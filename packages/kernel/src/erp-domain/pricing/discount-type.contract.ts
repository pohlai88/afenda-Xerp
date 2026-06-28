export const DISCOUNT_TYPES = [
  "percent",
  "amount",
  "bundle",
  "volume",
] as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export function isDiscountType(value: string): value is DiscountType {
  return (DISCOUNT_TYPES as readonly string[]).includes(value);
}
