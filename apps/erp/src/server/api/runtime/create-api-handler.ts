import { getAfendaAuthSession } from "@afenda/auth";
import { brandUserId, createExecutionContext } from "@afenda/kernel";
import { headers } from "next/headers";

import type { ApiRouteContract } from "../contracts/api-contract";
import { isMutationMethod } from "../contracts/api-route-policy.contract";
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
import {
  type ApiRequestContext,
  assertRoutePermission,
  createApiRequestContext,
} from "./api-request-context";
import { jsonErrorResponse, jsonSuccessResponse } from "./api-response";
import {
  isApiRouteError,
  parseRequestBody,
  parseResponseData,
  readJsonBody,
} from "./api-validation";

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
      logApiRequest(
        {
          contractId: config.contract.id,
          correlationId,
          durationMs: Date.now() - startedAt,
          errorCode: "method_not_allowed",
          method: request.method,
          path: config.contract.path,
          requestId,
          statusCode: 405,
        },
        logger
      );
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
        requestBody = parseRequestBody(
          config.contract.requestSchema,
          undefined
        );
      } else {
        const rawBody = await readJsonBody(request);
        requestBody = parseRequestBody(config.contract.requestSchema, rawBody);
      }

      const userId = brandUserId(session?.user.userId ?? null);
      const provisionalExecution = createExecutionContext({
        actorId: userId,
        correlationId,
        source: "api",
      });

      let context = createApiRequestContext({
        contract: config.contract,
        correlationId,
        execution: provisionalExecution,
        request,
        requestBody,
        requestId,
        session,
        userId,
      });

      context = (await assertRoutePermission(
        context,
        config.contract.permission
      )) as ApiRequestContext<TRequest>;

      const result = await config.handler(context);
      const dto = parseResponseData(config.contract.responseSchema, result);

      await emitApiAuditEvidence(config.contract.audit, context);

      const response = jsonSuccessResponse(
        dto,
        meta,
        config.contract.cache,
        config.contract.method === "POST" ? 201 : 200
      );

      logApiRequest(
        {
          contractId: config.contract.id,
          correlationId,
          durationMs: Date.now() - startedAt,
          method: request.method,
          path: config.contract.path,
          requestId,
          statusCode: response.status,
        },
        logger
      );

      return response;
    } catch (error: unknown) {
      const code = mapUnknownErrorToApiCode(error);
      const message = resolvePublicErrorMessage(code, error);
      const details = resolveErrorDetails(error);

      if (
        isMutationMethod(config.contract.method) &&
        (code === "forbidden" || code === "unauthenticated") &&
        config.contract.audit?.enabled
      ) {
        await emitApiDeniedAuditEvidence(config.contract.audit, {
          correlationId,
          requestId,
          userId: null,
        });
      }

      const response = jsonErrorResponse(code, message, meta, details);

      logApiRequest(
        {
          contractId: config.contract.id,
          correlationId,
          durationMs: Date.now() - startedAt,
          errorCode: code,
          method: request.method,
          path: config.contract.path,
          requestId,
          statusCode: response.status,
        },
        logger
      );

      if (resolveErrorLogLevel(code) === "error" && !isApiRouteError(error)) {
        logger.error("api.request.unexpected", {
          contractId: config.contract.id,
          reason: error instanceof Error ? error.message : "unknown",
          requestId,
        });
      }

      return response;
    }
  };
}
