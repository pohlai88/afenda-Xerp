export const SALES_ORDER_STATUSES = [
  "draft",
  "confirmed",
  "partially_shipped",
  "fulfilled",
  "cancelled",
] as const;

export type SalesOrderStatus = (typeof SALES_ORDER_STATUSES)[number];

export function isSalesOrderStatus(value: string): value is SalesOrderStatus {
  return (SALES_ORDER_STATUSES as readonly string[]).includes(value);
}
