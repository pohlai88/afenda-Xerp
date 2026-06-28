export const STOCK_MOVEMENT_TYPES = [
  "receipt",
  "issue",
  "transfer",
  "adjustment",
  "return",
] as const;

export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number];

export function isStockMovementType(value: string): value is StockMovementType {
  return (STOCK_MOVEMENT_TYPES as readonly string[]).includes(value);
}
