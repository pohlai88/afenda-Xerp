export const STOCK_RESERVATION_STATUSES = [
  "draft",
  "reserved",
  "fulfilled",
  "cancelled",
] as const;

export type StockReservationStatus =
  (typeof STOCK_RESERVATION_STATUSES)[number];

export function isStockReservationStatus(
  value: string
): value is StockReservationStatus {
  return (STOCK_RESERVATION_STATUSES as readonly string[]).includes(value);
}
