export const PURCHASE_ORDER_STATUSES = [
  "draft",
  "sent",
  "acknowledged",
  "partially_received",
  "received",
  "closed",
  "cancelled",
] as const;

export type PurchaseOrderStatus = (typeof PURCHASE_ORDER_STATUSES)[number];

export function isPurchaseOrderStatus(
  value: string
): value is PurchaseOrderStatus {
  return (PURCHASE_ORDER_STATUSES as readonly string[]).includes(value);
}
