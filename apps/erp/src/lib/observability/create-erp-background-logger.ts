import type { Logger } from "@afenda/observability";

import { createErpLogger, type ErpLoggerContext } from "./create-erp-logger";
import {
  createErpCorrelationId,
  type ErpCorrelationId,
} from "./erp-correlation-id";

export interface CreateErpBackgroundLoggerInput {
  readonly correlationId?: ErpCorrelationId;
  readonly correlationPrefix?: string;
  readonly module: string;
}

/** Logger factory for cron jobs and other non-request Node.js work. */
export function createErpBackgroundLogger(
  input: CreateErpBackgroundLoggerInput
): Logger {
  const context: ErpLoggerContext = {
    correlationId: input.correlationId ?? createErpCorrelationId(),
    module: input.module,
  };

  return createErpLogger(context);
}
