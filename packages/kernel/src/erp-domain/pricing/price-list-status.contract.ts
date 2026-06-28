export const PRICE_LIST_STATUSES = [
  "draft",
  "active",
  "expired",
  "archived",
] as const;

export type PriceListStatus = (typeof PRICE_LIST_STATUSES)[number];

export function isPriceListStatus(value: string): value is PriceListStatus {
  return (PRICE_LIST_STATUSES as readonly string[]).includes(value);
}
