import type { Logger, LogMetadata } from "@afenda/observability";

import { createErpLogger } from "@/lib/observability/create-erp-logger";
import { toErpCorrelationId } from "@/lib/observability/erp-correlation-id";
import { ERP_LOGGER_MODULES } from "@/lib/observability/erp-diagnostic-defaults";

export interface ApiHandlerLogContext {
  readonly contractId: string;
  readonly correlationId: string;
  readonly durationMs: number;
  readonly errorCode?: string;
  readonly method: string;
  readonly path: string;
  readonly requestId: string;
  readonly statusCode: number;
}

function buildApiRequestMetadata(context: ApiHandlerLogContext): LogMetadata {
  return {
    contractId: context.contractId,
    correlationId: context.correlationId,
    durationMs: context.durationMs,
    method: context.method,
    path: context.path,
    requestId: context.requestId,
    statusCode: context.statusCode,
    ...(context.errorCode === undefined
      ? {}
      : { errorCode: context.errorCode }),
  };
}

export function logApiRequest(
  context: ApiHandlerLogContext,
  logger: Logger
): void {
  const metadata = buildApiRequestMetadata(context);

  if (context.statusCode >= 500) {
    logger.error("api.request.failed", metadata);
    return;
  }

  if (context.statusCode >= 400) {
    logger.warn("api.request.rejected", metadata);
    return;
  }

  logger.info("api.request.completed", metadata);
}

export function createApiHandlerLogger(correlationId: string): Logger {
  return createErpLogger({
    correlationId: toErpCorrelationId(correlationId),
    module: ERP_LOGGER_MODULES.apiHandler,
  });
}
