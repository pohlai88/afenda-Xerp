import { parseOptionalUserId } from "@afenda/kernel";
import { headers } from "next/headers";
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
import type { PaginationMeta } from "../contracts/pagination.contract";
import {
  mergePaginationIntoMeta,
  parsePaginationQuery,
} from "../contracts/pagination.contract";
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
import { assertRateLimitAllowed } from "./api-rate-limit";
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

const SERVICE_ACTOR_ACCEPTING_AUTH_POLICIES = new Set<ApiAuthPolicy>([
  "service-token-required",
  "internal-only",
]);

/**
 * ADR-0034 — enforce contract authPolicy before body parse / handler.
 * Session-only production: reject forged S2S headers on session/public routes.
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

  if (authPolicy === "service-token-required") {
    throw new ApiRouteError(
      "unauthenticated",
      "Service-token routes are not enabled until token verification is implemented."
    );
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

async function executeHandlerBody<TRequest, TResponse>(input: {
  readonly config: {
    readonly contract: ApiRouteContract<TRequest, TResponse>;
    readonly handler: (
      context: ApiRequestContext<TRequest>
    ) => Promise<TResponse | PaginatedApiHandlerResult<TResponse>>;
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
  const requestHeaders = await headers();
  const authActor = await resolveApiRouteAuthActor(requestHeaders);

  assertApiRouteAuthPolicy({
    authActor,
    contract: input.config.contract,
    request: input.request,
  });

  const session = authActor?.kind === "human" ? authActor.session : null;

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

  const userId = parseOptionalUserId(session?.user.userId ?? null);
  const provisionalExecution = createServerExecutionContext({
    actorId: userId,
    correlationId: input.correlationId,
    source: "api",
  });

  let context = createApiRequestContext({
    contract: input.config.contract,
    correlationId: input.correlationId,
    execution: provisionalExecution,
    ...(input.config.contract.pagination?.mode === "cursor"
      ? {
          paginationQuery: parsePaginationQuery(
            new URL(input.request.url).searchParams
          ),
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

  await assertRateLimitAllowed({
    contractId: input.config.contract.id,
    policy: input.config.contract.rateLimitPolicy,
    requestId: input.requestId,
    userId: context.userId?.toString() ?? null,
  });

  const idempotencyKey = acceptsIdempotencyKey(
    input.config.contract.idempotency
  )
    ? resolveRequestIdempotencyKey(
        input.request,
        input.config.contract.idempotency
      )
    : null;

  if (idempotencyKey !== null) {
    const cached = await readCachedIdempotentResponse({
      contractId: input.config.contract.id,
      idempotencyKey,
      responseSchema: input.config.contract.responseSchema,
      tenantId: context.execution.tenantId,
      userId: context.userId,
    });

    if (cached !== null) {
      const response = jsonSuccessResponse(
        cached.data,
        input.meta,
        input.config.contract.cache,
        cached.statusCode
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
      return response;
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
    successStatus
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

  return response;
}

export function createApiHandler<TRequest, TResponse>(config: {
  readonly contract: ApiRouteContract<TRequest, TResponse>;
  readonly handler: (
    context: ApiRequestContext<TRequest>
  ) => Promise<TResponse | PaginatedApiHandlerResult<TResponse>>;
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
      return response;
    }

    try {
      return await executeHandlerBody({
        config,
        correlationId,
        logger,
        meta,
        request,
        requestId,
        startedAt,
      });
    } catch (error: unknown) {
      const code = mapUnknownErrorToApiCode(error);
      const message = resolvePublicErrorMessage(code, error);
      const details = resolveErrorDetails(error);

      if (
        isMutationMethod(config.contract.method) &&
        (code === "forbidden" || code === "unauthenticated") &&
        config.contract.audit?.enabled
      ) {
        const requestHeaders = await headers();
        const authActor = await resolveApiRouteAuthActor(requestHeaders);
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

      return response;
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
