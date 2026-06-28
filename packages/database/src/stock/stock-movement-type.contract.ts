/**
 * Inventory stock movement types — inventory domain Slice 3 (ADR-0020 persistence model).
 */
export const STOCK_MOVEMENT_TYPES = ["receipt", "issue", "adjustment"] as const;

export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number];

export function isStockMovementType(value: string): value is StockMovementType {
  return (STOCK_MOVEMENT_TYPES as readonly string[]).includes(value);
}
