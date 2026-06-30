import { parseOptionalUserId } from "@afenda/kernel";
import type { ApiRouteAuthActor } from "@/lib/auth/resolve-api-route-auth-actor.server";
import { resolveApiRouteAuthActor } from "@/lib/auth/resolve-api-route-auth-actor.server";
import { hasServiceActorIngressHeaders } from "@/lib/auth/resolve-service-actor.server";
import { createServerExecutionContext } from "@/lib/context/create-server-execution-context.server";
import { runProtectedMutation } from "@/lib/spine/run-protected-mutation";
import type { ApiRouteContract } from "../contracts/api-contract";
import type { ApiContractId } from "../contracts/api-contract-registry";
import { getApiContractById } from "../contracts/api-contract-registry";
import { isMutationMethod } from "../contracts/api-route-policy.contract";
import {
  type ApiAuthPolicy,
  requiresSessionAuth,
} from "../contracts/auth-policy.contract";
import { acceptsIdempotencyKey } from "../contracts/idempotency.contract";
import { parseListQuery } from "../contracts/list-query.contract";
import type { PaginationMeta } from "../contracts/pagination.contract";
import { mergePaginationIntoMeta } from "../contracts/pagination.contract";
import { createRequestId, resolveCorrelationId } from "./api-correlation";
import {
  mapUnknownErrorToApiCode,
  resolveErrorDetails,
  resolveErrorLogLevel,
  resolvePublicErrorMessage,
} from "./api-error";
import {
  emitApiAuditEvidence,
  emitApiDeniedAuditEvidence,
} from "./api-handler-audit";
import { createApiHandlerLogger, logApiRequest } from "./api-handler-logging";
import { applyLifecycleResponseHeaders } from "./api-lifecycle-headers";
import { consumeRateLimitForRequest } from "./api-rate-limit";
import {
  type ApiRequestContext,
  assertRoutePermission,
  createApiRequestContext,
} from "./api-request-context";
import { jsonErrorResponse, jsonSuccessResponse } from "./api-response";
import {
  ApiRouteError,
  isApiRouteError,
  parseRequestBody,
  parseResponseData,
  readJsonBody,
} from "./api-validation";
import {
  computeIdempotencyRequestFingerprint,
  readCachedIdempotentResponse,
  recordIdempotentResponse,
  resolveRequestIdempotencyKey,
} from "./idempotency";

export interface PaginatedApiHandlerResult<TResponse> {
  readonly data: TResponse;
  readonly pagination: PaginationMeta;
}

function isPaginatedApiHandlerResult<TResponse>(
  result: TResponse | PaginatedApiHandlerResult<TResponse>
): result is PaginatedApiHandlerResult<TResponse> {
  return (
    typeof result === "object" &&
    result !== null &&
    "data" in result &&
    "pagination" in result
  );
}

function isRawHandlerResponse(result: unknown): result is Response {
  return result instanceof Response;
}

const SERVICE_ACTOR_ACCEPTING_AUTH_POLICIES = new Set<ApiAuthPolicy>([
  "service-token-required",
  "internal-only",
]);

/**
 * ADR-0035 — enforce contract authPolicy before body parse / handler.
 * Reject unverified S2S headers on session/public routes; require verified service actor on service-token routes.
 */
export function assertApiRouteAuthPolicy(input: {
  readonly authActor: ApiRouteAuthActor | null;
  readonly contract: ApiRouteContract<unknown, unknown>;
  readonly request: Request;
}): void {
  const { authPolicy } = input.contract;

  if (
    hasServiceActorIngressHeaders(input.request.headers) &&
    !SERVICE_ACTOR_ACCEPTING_AUTH_POLICIES.has(authPolicy)
  ) {
    throw new ApiRouteError(
      "unauthenticated",
      "Service actor ingress is not accepted for this operation."
    );
  }

  if (
    authPolicy === "service-token-required" ||
    authPolicy === "internal-only"
  ) {
    if (input.authActor?.kind !== "service") {
      throw new ApiRouteError(
        "unauthenticated",
        "A verified service actor is required for this operation."
      );
    }
    return;
  }

  if (requiresSessionAuth(authPolicy) && input.authActor?.kind !== "human") {
    throw new ApiRouteError(
      "unauthenticated",
      "A signed-in session is required for this operation."
    );
  }
}

function unwrapHandlerResponse<TResponse>(
  result: TResponse | PaginatedApiHandlerResult<TResponse>
): TResponse {
  if (isPaginatedApiHandlerResult(result)) {
    return result.data;
  }

  return result;
}

function resolveHandlerSuccessStatus<TResponse>(
  method: ApiRouteContract<unknown, TResponse>["method"],
  dto: TResponse,
  resolveSuccessStatus?: (data: TResponse) => number
): number {
  if (resolveSuccessStatus) {
    return resolveSuccessStatus(dto);
  }

  return method === "POST" ? 201 : 200;
}

function logHandlerSuccess(input: {
  readonly contractId: string;
  readonly correlationId: string;
  readonly durationMs: number;
  readonly logger: ReturnType<typeof createApiHandlerLogger>;
  readonly method: string;
  readonly path: string;
  readonly requestId: string;
  readonly statusCode: number;
}): void {
  logApiRequest(
    {
      contractId: input.contractId,
      correlationId: input.correlationId,
      durationMs: input.durationMs,
      method: input.method,
      path: input.path,
      requestId: input.requestId,
      statusCode: input.statusCode,
    },
    input.logger
  );
}

function logHandlerFailure(input: {
  readonly code: string;
  readonly contractId: string;
  readonly correlationId: string;
  readonly durationMs: number;
  readonly error: unknown;
  readonly logger: ReturnType<typeof createApiHandlerLogger>;
  readonly method: string;
  readonly path: string;
  readonly requestId: string;
  readonly statusCode: number;
}): void {
  logApiRequest(
    {
      contractId: input.contractId,
      correlationId: input.correlationId,
      durationMs: input.durationMs,
      errorCode: input.code,
      method: input.method,
      path: input.path,
      requestId: input.requestId,
      statusCode: input.statusCode,
    },
    input.logger
  );

  if (
    resolveErrorLogLevel(
      input.code as Parameters<typeof resolveErrorLogLevel>[0]
    ) === "error" &&
    !isApiRouteError(input.error)
  ) {
    input.logger.error("api.request.unexpected", {
      contractId: input.contractId,
      reason: input.error instanceof Error ? input.error.message : "unknown",
      requestId: input.requestId,
    });
  }
}

function shouldParseListQuery(
  contract: ApiRouteContract<unknown, unknown>
): boolean {
  return (
    contract.listQuery !== undefined || contract.pagination?.mode === "cursor"
  );
}

function resolveListQueryOptions(
  contract: ApiRouteContract<unknown, unknown>
): {
  readonly allowedFilterFields: readonly string[];
  readonly allowedSortFields: readonly string[];
} {
  return {
    allowedFilterFields: contract.listQuery?.allowedFilterFields ?? [],
    allowedSortFields: contract.listQuery?.allowedSortFields ?? [],
  };
}

async function executeHandlerBody<TRequest, TResponse>(input: {
  readonly config: {
    readonly contract: ApiRouteContract<TRequest, TResponse>;
    readonly handler: (
      context: ApiRequestContext<TRequest>
    ) => Promise<TResponse | PaginatedApiHandlerResult<TResponse> | Response>;
    readonly resolveSuccessStatus?: (data: TResponse) => number;
  };
  readonly correlationId: string;
  readonly logger: ReturnType<typeof createApiHandlerLogger>;
  readonly meta: {
    readonly correlationId: string;
    readonly requestId: string;
    readonly timestamp: string;
  };
  readonly request: Request;
  readonly requestId: string;
  readonly startedAt: number;
}): Promise<Response> {
  const requestHeaders = input.request.headers;
  const authActor = await resolveApiRouteAuthActor(requestHeaders);

  assertApiRouteAuthPolicy({
    authActor,
    contract: input.config.contract,
    request: input.request,
  });

  const session = authActor?.kind === "human" ? authActor.session : null;
  const userId =
    authActor?.kind === "human"
      ? parseOptionalUserId(session?.user.userId ?? null)
      : null;

  let requestBody: TRequest;
  if (
    input.config.contract.method === "GET" ||
    input.config.contract.method === "DELETE"
  ) {
    requestBody = parseRequestBody(
      input.config.contract.requestSchema,
      undefined
    );
  } else {
    const rawBody = await readJsonBody(input.request);
    requestBody = parseRequestBody(
      input.config.contract.requestSchema,
      rawBody
    );
  }

  const provisionalExecution = createServerExecutionContext({
    actorId: userId,
    correlationId: input.correlationId,
    source: "api",
  });

  const searchParams = new URL(input.request.url).searchParams;
  const listQueryOptions = resolveListQueryOptions(input.config.contract);
  const parsesListQuery = shouldParseListQuery(input.config.contract);
  const parsedListQuery = parsesListQuery
    ? parseListQuery(searchParams, listQueryOptions)
    : undefined;

  let context = createApiRequestContext({
    contract: input.config.contract,
    correlationId: input.correlationId,
    execution: provisionalExecution,
    ...(parsedListQuery === undefined ? {} : { listQuery: parsedListQuery }),
    ...(input.config.contract.pagination?.mode === "cursor" &&
    parsedListQuery !== undefined
      ? {
          paginationQuery: {
            cursor: parsedListQuery.cursor,
            limit: parsedListQuery.limit,
          },
        }
      : {}),
    request: input.request,
    requestBody,
    requestId: input.requestId,
    session,
    userId,
  });

  context = (await assertRoutePermission(
    context,
    input.config.contract.permission
  )) as ApiRequestContext<TRequest>;

  const rateLimitContext = {
    contractId: input.config.contract.id,
    policy: input.config.contract.rateLimitPolicy,
    requestId: input.requestId,
    userId:
      authActor?.kind === "service"
        ? authActor.identity.authSubjectId
        : (context.userId?.toString() ?? null),
  };

  const rateLimitSnapshot = await consumeRateLimitForRequest(rateLimitContext);
  if (rateLimitSnapshot !== null && !rateLimitSnapshot.allowed) {
    const response = jsonErrorResponse(
      "rate_limited",
      "Too many requests. Please retry later.",
      input.meta,
      rateLimitSnapshot.retryAfterSeconds === null
        ? undefined
        : { retryAfterSeconds: rateLimitSnapshot.retryAfterSeconds },
      rateLimitSnapshot
    );

    logHandlerFailure({
      code: "rate_limited",
      contractId: input.config.contract.id,
      correlationId: input.correlationId,
      durationMs: Date.now() - input.startedAt,
      error: new ApiRouteError(
        "rate_limited",
        "Too many requests. Please retry later."
      ),
      logger: input.logger,
      method: input.request.method,
      path: input.config.contract.path,
      requestId: input.requestId,
      statusCode: response.status,
    });

    return applyLifecycleResponseHeaders(response, input.config.contract);
  }

  const idempotencyKey = acceptsIdempotencyKey(
    input.config.contract.idempotency
  )
    ? resolveRequestIdempotencyKey(
        input.request,
        input.config.contract.idempotency
      )
    : null;

  if (idempotencyKey !== null) {
    const requestFingerprint = computeIdempotencyRequestFingerprint(
      context.requestBody
    );
    const cached = await readCachedIdempotentResponse({
      contractId: input.config.contract.id,
      idempotencyKey,
      requestFingerprint,
      responseSchema: input.config.contract.responseSchema,
      tenantId: context.execution.tenantId,
      userId: context.userId,
    });

    if (cached !== null) {
      const response = jsonSuccessResponse(
        cached.data,
        input.meta,
        input.config.contract.cache,
        cached.statusCode,
        rateLimitSnapshot
      );
      logHandlerSuccess({
        contractId: input.config.contract.id,
        correlationId: input.correlationId,
        durationMs: Date.now() - input.startedAt,
        logger: input.logger,
        method: input.request.method,
        path: input.config.contract.path,
        requestId: input.requestId,
        statusCode: response.status,
      });
      return applyLifecycleResponseHeaders(response, input.config.contract);
    }
  }

  const result = isMutationMethod(input.config.contract.method)
    ? (
        await runProtectedMutation({
          context,
          execute: async (_scope) => input.config.handler(context),
          onObservability: ({ correlationId, scope }) => {
            input.logger.info("spine.mutation.executing", {
              companyId: scope.companyId,
              correlationId,
              tenantId: scope.tenantId,
            });
          },
        })
      ).result
    : await input.config.handler(context);

  if (isRawHandlerResponse(result)) {
    logHandlerSuccess({
      contractId: input.config.contract.id,
      correlationId: input.correlationId,
      durationMs: Date.now() - input.startedAt,
      logger: input.logger,
      method: input.request.method,
      path: input.config.contract.path,
      requestId: input.requestId,
      statusCode: result.status,
    });
    return applyLifecycleResponseHeaders(result, input.config.contract);
  }

  const paginatedResult = isPaginatedApiHandlerResult(result) ? result : null;
  const dto = parseResponseData(
    input.config.contract.responseSchema,
    unwrapHandlerResponse(result)
  );
  const successStatus = resolveHandlerSuccessStatus(
    input.config.contract.method,
    dto,
    input.config.resolveSuccessStatus
  );

  if (idempotencyKey !== null) {
    await recordIdempotentResponse(
      {
        contractId: input.config.contract.id,
        idempotencyKey,
        tenantId: context.execution.tenantId,
        userId: context.userId,
      },
      {
        data: dto,
        requestFingerprint: computeIdempotencyRequestFingerprint(
          context.requestBody
        ),
        statusCode: successStatus,
      }
    );
  }

  await emitApiAuditEvidence(input.config.contract.audit, context);

  const responseMeta =
    paginatedResult === null
      ? input.meta
      : mergePaginationIntoMeta(input.meta, paginatedResult.pagination);

  const response = jsonSuccessResponse(
    dto,
    responseMeta,
    input.config.contract.cache,
    successStatus,
    rateLimitSnapshot
  );

  logHandlerSuccess({
    contractId: input.config.contract.id,
    correlationId: input.correlationId,
    durationMs: Date.now() - input.startedAt,
    logger: input.logger,
    method: input.request.method,
    path: input.config.contract.path,
    requestId: input.requestId,
    statusCode: response.status,
  });

  return applyLifecycleResponseHeaders(response, input.config.contract);
}

export function createApiHandler<TRequest, TResponse>(config: {
  readonly contract: ApiRouteContract<TRequest, TResponse>;
  readonly handler: (
    context: ApiRequestContext<TRequest>
  ) => Promise<TResponse | PaginatedApiHandlerResult<TResponse> | Response>;
  readonly resolveSuccessStatus?: (data: TResponse) => number;
}): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    const startedAt = Date.now();
    const requestId = createRequestId();
    const correlationId = resolveCorrelationId(request);
    const logger = createApiHandlerLogger(correlationId);
    const meta = {
      correlationId,
      requestId,
      timestamp: new Date().toISOString(),
    };

    if (request.method !== config.contract.method) {
      const response = jsonErrorResponse(
        "method_not_allowed",
        "HTTP method is not allowed for this route.",
        meta
      );
      logHandlerSuccess({
        contractId: config.contract.id,
        correlationId,
        durationMs: Date.now() - startedAt,
        logger,
        method: request.method,
        path: config.contract.path,
        requestId,
        statusCode: 405,
      });
      return applyLifecycleResponseHeaders(response, config.contract);
    }

    try {
      return applyLifecycleResponseHeaders(
        await executeHandlerBody({
          config,
          correlationId,
          logger,
          meta,
          request,
          requestId,
          startedAt,
        }),
        config.contract
      );
    } catch (error: unknown) {
      const code = mapUnknownErrorToApiCode(error);
      const message = resolvePublicErrorMessage(code, error);
      const details = resolveErrorDetails(error);

      if (
        isMutationMethod(config.contract.method) &&
        (code === "forbidden" || code === "unauthenticated") &&
        config.contract.audit?.enabled
      ) {
        const authActor = await resolveApiRouteAuthActor(request.headers);
        const deniedUserId =
          authActor?.kind === "human"
            ? (authActor.session.user.userId ?? null)
            : authActor?.kind === "service"
              ? authActor.identity.authSubjectId
              : null;

        await emitApiDeniedAuditEvidence(config.contract.audit, {
          correlationId,
          requestId,
          userId: deniedUserId,
        });
      }

      const response = jsonErrorResponse(code, message, meta, details);

      logHandlerFailure({
        code,
        contractId: config.contract.id,
        correlationId,
        durationMs: Date.now() - startedAt,
        error,
        logger,
        method: request.method,
        path: config.contract.path,
        requestId,
        statusCode: response.status,
      });

      return applyLifecycleResponseHeaders(response, config.contract);
    }
  };
}

/**
 * Registry-id handler factory. The contract id is validated at compile time;
 * request/response types are caller-owned and must match the registered contract.
 */
export function createApiHandlerById<TRequest, TResponse>(
  contractId: ApiContractId,
  handler: (
    context: ApiRequestContext<TRequest>
  ) => Promise<TResponse | PaginatedApiHandlerResult<TResponse>>
): (request: Request) => Promise<Response> {
  const contract = getApiContractById(
    contractId
  ) as unknown as ApiRouteContract<TRequest, TResponse>;

  return createApiHandler({
    contract,
    handler,
  });
}
