export const WEB_ORDER_STATUSES = [
  "pending",
  "paid",
  "fulfilled",
  "refunded",
] as const;

export type WebOrderStatus = (typeof WEB_ORDER_STATUSES)[number];

export function isWebOrderStatus(value: string): value is WebOrderStatus {
  return (WEB_ORDER_STATUSES as readonly string[]).includes(value);
}
