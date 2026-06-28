export const PRODUCTION_ORDER_STATUSES = [
  "planned",
  "released",
  "in_progress",
  "completed",
  "closed",
  "cancelled",
] as const;

export type ProductionOrderStatus = (typeof PRODUCTION_ORDER_STATUSES)[number];

export function isProductionOrderStatus(
  value: string
): value is ProductionOrderStatus {
  return (PRODUCTION_ORDER_STATUSES as readonly string[]).includes(value);
}
