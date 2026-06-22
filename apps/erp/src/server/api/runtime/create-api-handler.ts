import { getAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";

import type { ApiRouteContract } from "../contracts/api-contract";
import type { ApiAuditPolicy } from "../contracts/api-contract";
import {
  mapUnknownErrorToApiCode,
  resolveErrorDetails,
  resolveErrorLogLevel,
  resolvePublicErrorMessage,
} from "./api-error";
import {
  createApiRequestContext,
  assertRoutePermission,
  type ApiRequestContext,
} from "./api-request-context";
import {
  createRequestId,
  resolveCorrelationId,
} from "./api-correlation";
import {
  jsonErrorResponse,
  jsonSuccessResponse,
} from "./api-response";
import {
  ApiRouteError,
  isApiRouteError,
  parseRequestBody,
  parseResponseData,
  readJsonBody,
} from "./api-validation";

interface ApiHandlerLogContext {
  readonly contractId: string;
  readonly correlationId: string;
  readonly durationMs: number;
  readonly errorCode?: string;
  readonly method: string;
  readonly path: string;
  readonly requestId: string;
  readonly statusCode: number;
}

function logApiRequest(context: ApiHandlerLogContext): void {
  const payload = {
    contractId: context.contractId,
    correlationId: context.correlationId,
    durationMs: context.durationMs,
    errorCode: context.errorCode,
    method: context.method,
    path: context.path,
    requestId: context.requestId,
    statusCode: context.statusCode,
  };

  if (context.statusCode >= 500) {
    console.error("api.request.failed", payload);
    return;
  }

  if (context.statusCode >= 400) {
    console.warn("api.request.rejected", payload);
    return;
  }

  console.info("api.request.completed", payload);
}

function emitAuditEvidence(
  audit: ApiAuditPolicy | undefined,
  context: ApiRequestContext<unknown>
): void {
  if (audit === undefined || !audit.enabled) {
    return;
  }

  console.info("api.audit", {
    action: audit.action,
    actorId: context.userId,
    correlationId: context.correlationId,
    requestId: context.requestId,
    targetType: audit.targetType,
  });
}

export function createApiHandler<TRequest, TResponse>(config: {
  readonly contract: ApiRouteContract<TRequest, TResponse>;
  readonly handler: (
    context: ApiRequestContext<TRequest>
  ) => Promise<TResponse>;
}): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    const startedAt = Date.now();
    const requestId = createRequestId();
    const correlationId = resolveCorrelationId(request);
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
      logApiRequest({
        contractId: config.contract.id,
        correlationId,
        durationMs: Date.now() - startedAt,
        errorCode: "method_not_allowed",
        method: request.method,
        path: config.contract.path,
        requestId,
        statusCode: 405,
      });
      return response;
    }

    try {
      const requestHeaders = await headers();
      const session = await getAfendaAuthSession(requestHeaders);

      let requestBody: TRequest;
      if (
        config.contract.method === "GET" ||
        config.contract.method === "DELETE"
      ) {
        requestBody = parseRequestBody(config.contract.requestSchema, undefined);
      } else {
        const rawBody = await readJsonBody(request);
        requestBody = parseRequestBody(config.contract.requestSchema, rawBody);
      }

      const context = createApiRequestContext({
        contract: config.contract,
        correlationId,
        request,
        requestBody,
        requestId,
        session,
      });

      await assertRoutePermission(context, config.contract.permission);

      const result = await config.handler(context);
      const dto = parseResponseData(config.contract.responseSchema, result);

      emitAuditEvidence(config.contract.audit, context);

      const response = jsonSuccessResponse(
        dto,
        meta,
        config.contract.cache,
        config.contract.method === "POST" ? 201 : 200
      );

      logApiRequest({
        contractId: config.contract.id,
        correlationId,
        durationMs: Date.now() - startedAt,
        method: request.method,
        path: config.contract.path,
        requestId,
        statusCode: response.status,
      });

      return response;
    } catch (error: unknown) {
      const code = mapUnknownErrorToApiCode(error);
      const message = resolvePublicErrorMessage(code, error);
      const details = resolveErrorDetails(error);
      const response = jsonErrorResponse(code, message, meta, details);

      logApiRequest({
        contractId: config.contract.id,
        correlationId,
        durationMs: Date.now() - startedAt,
        errorCode: code,
        method: request.method,
        path: config.contract.path,
        requestId,
        statusCode: response.status,
      });

      if (resolveErrorLogLevel(code) === "error" && !isApiRouteError(error)) {
        console.error("api.request.unexpected", {
          contractId: config.contract.id,
          correlationId,
          requestId,
        });
      }

      return response;
    }
  };
}
