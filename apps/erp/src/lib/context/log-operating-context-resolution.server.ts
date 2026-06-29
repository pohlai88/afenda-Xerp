import type { OperatingContextErrorCode } from "@afenda/kernel";

import { createErpLogger } from "../observability/create-erp-logger";
import { toErpCorrelationId } from "../observability/erp-correlation-id";
import { ERP_LOGGER_MODULES } from "../observability/erp-diagnostic-defaults";

export interface LogOperatingContextResolutionInput {
  readonly correlationId: string;
  readonly errorCode?: OperatingContextErrorCode;
  readonly outcome: "denied" | "resolved";
  readonly tenantSlug: string;
}

/**
 * Safe diagnostics for operating context resolution — no actor IDs or entity UUIDs.
 */
export function logOperatingContextResolution(
  input: LogOperatingContextResolutionInput
): void {
  const logger = createErpLogger({
    correlationId: toErpCorrelationId(input.correlationId),
    module: ERP_LOGGER_MODULES.operatingContext,
  });

  if (input.outcome === "denied") {
    logger.warn("operating_context.denied", {
      ...(input.errorCode === undefined ? {} : { code: input.errorCode }),
      tenantSlug: input.tenantSlug,
    });
    return;
  }

  logger.debug("operating_context.resolved", {
    tenantSlug: input.tenantSlug,
  });
}
