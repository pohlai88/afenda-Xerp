import type { AppError } from "@afenda/kernel";
import type { LogMetadata } from "@afenda/observability";

import { createRequestBoundErpLogger } from "../observability/create-request-bound-logger";
import { ERP_LOGGER_MODULES } from "../observability/erp-diagnostic-defaults";

interface LogServerActionErrorInput {
  readonly action: string;
  readonly error: AppError;
  readonly userId?: string;
}

function buildActionErrorMetadata(
  input: LogServerActionErrorInput
): LogMetadata {
  return {
    action: input.action,
    code: input.error.code,
    ...(input.userId === undefined ? {} : { userId: input.userId }),
  };
}

export async function logServerActionError(
  input: LogServerActionErrorInput
): Promise<void> {
  const logger = await createRequestBoundErpLogger(
    ERP_LOGGER_MODULES.serverAction
  );
  const metadata = buildActionErrorMetadata(input);

  if (
    input.error.code === "INTERNAL_ERROR" &&
    input.error.cause !== undefined
  ) {
    logger.error("server-action.failed", {
      ...metadata,
      reason:
        input.error.cause instanceof Error
          ? input.error.cause.message
          : "unknown",
    });
    return;
  }

  if (input.error.code === "VALIDATION_ERROR") {
    logger.warn("server-action.validation_failed", metadata);
    return;
  }

  logger.warn("server-action.rejected", metadata);
}
