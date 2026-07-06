import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

/**
 * Domain-scoped branded IDs (PAS-001B Rule 2).
 * SupplierId and ProductId remain under kernel business-reference authority.
 */

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
