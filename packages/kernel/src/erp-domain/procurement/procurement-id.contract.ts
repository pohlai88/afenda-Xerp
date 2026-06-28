import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";

/**
 * Domain-scoped branded IDs (PAS-001B Rule 2).
 * SupplierId and ProductId remain under kernel business-reference authority.
 */

function brandTrimRequired<T extends string>(
  value: string | Brand<string, T>,
  label: string
): Brand<string, T> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, T>;
}

export type PurchaseRequisitionId = Brand<string, "PurchaseRequisitionId">;
export type PurchaseOrderId = Brand<string, "PurchaseOrderId">;
export type RfqId = Brand<string, "RfqId">;

export function brandPurchaseRequisitionId(
  value: string | PurchaseRequisitionId
): PurchaseRequisitionId {
  return brandTrimRequired(
    value,
    "purchaseRequisitionId"
  ) as PurchaseRequisitionId;
}

export function brandPurchaseOrderId(
  value: string | PurchaseOrderId
): PurchaseOrderId {
  return brandTrimRequired(value, "purchaseOrderId") as PurchaseOrderId;
}

export function brandRfqId(value: string | RfqId): RfqId {
  return brandTrimRequired(value, "rfqId") as RfqId;
}

export function toPurchaseRequisitionId(value: PurchaseRequisitionId): string {
  return unbrand(value);
}

export function toPurchaseOrderId(value: PurchaseOrderId): string {
  return unbrand(value);
}

export function toRfqId(value: RfqId): string {
  return unbrand(value);
}
