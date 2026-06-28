export const CART_STATUSES = [
  "active",
  "abandoned",
  "converted",
  "merged",
] as const;

export type CartStatus = (typeof CART_STATUSES)[number];

export function isCartStatus(value: string): value is CartStatus {
  return (CART_STATUSES as readonly string[]).includes(value);
}
