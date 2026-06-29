import { createCorrelationId } from "@afenda/observability";

declare const erpCorrelationIdBrand: unique symbol;

/** Branded correlation ID for ERP diagnostic and audit boundaries. */
export type ErpCorrelationId = string & {
  readonly [erpCorrelationIdBrand]: true;
};

export function toErpCorrelationId(value: string): ErpCorrelationId {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error("correlationId is required.");
  }

  return normalized as ErpCorrelationId;
}

/** Generates and brands a new correlation ID (cron, bootstrap, background jobs). */
export function createErpCorrelationId(prefix = "corr"): ErpCorrelationId {
  return toErpCorrelationId(createCorrelationId(prefix));
}
