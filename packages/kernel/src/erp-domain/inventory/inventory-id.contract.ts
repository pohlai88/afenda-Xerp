import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";

/**
 * Domain-scoped branded IDs for inventory vocabulary (PAS-001B Rule 2).
 * ProductId, WarehouseId, SupplierId remain under kernel business-reference authority.
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

export type StockMovementId = Brand<string, "StockMovementId">;
export type StockAdjustmentId = Brand<string, "StockAdjustmentId">;
export type InventoryCountSessionId = Brand<string, "InventoryCountSessionId">;

export function brandStockMovementId(
  value: string | StockMovementId
): StockMovementId {
  return brandTrimRequired(value, "stockMovementId") as StockMovementId;
}

export function brandStockAdjustmentId(
  value: string | StockAdjustmentId
): StockAdjustmentId {
  return brandTrimRequired(value, "stockAdjustmentId") as StockAdjustmentId;
}

export function brandInventoryCountSessionId(
  value: string | InventoryCountSessionId
): InventoryCountSessionId {
  return brandTrimRequired(
    value,
    "inventoryCountSessionId"
  ) as InventoryCountSessionId;
}

export function toStockMovementId(value: StockMovementId): string {
  return unbrand(value);
}

export function toStockAdjustmentId(value: StockAdjustmentId): string {
  return unbrand(value);
}

export function toInventoryCountSessionId(
  value: InventoryCountSessionId
): string {
  return unbrand(value);
}
