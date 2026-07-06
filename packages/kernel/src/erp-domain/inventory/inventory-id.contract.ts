import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type StockMovementId = Brand<string, "StockMovementId">;

export function brandStockMovementId(
  value: string | StockMovementId
): StockMovementId {
  return brandTrimRequired(value, "stockMovementId") as StockMovementId;
}

export function toStockMovementId(value: StockMovementId): string {
  return unbrand(value);
}

export type StockAdjustmentId = Brand<string, "StockAdjustmentId">;

export function brandStockAdjustmentId(
  value: string | StockAdjustmentId
): StockAdjustmentId {
  return brandTrimRequired(value, "stockAdjustmentId") as StockAdjustmentId;
}

export function toStockAdjustmentId(value: StockAdjustmentId): string {
  return unbrand(value);
}

export type InventoryCountSessionId = Brand<string, "InventoryCountSessionId">;

export function brandInventoryCountSessionId(
  value: string | InventoryCountSessionId
): InventoryCountSessionId {
  return brandTrimRequired(
    value,
    "inventoryCountSessionId"
  ) as InventoryCountSessionId;
}

export function toInventoryCountSessionId(
  value: InventoryCountSessionId
): string {
  return unbrand(value);
}
