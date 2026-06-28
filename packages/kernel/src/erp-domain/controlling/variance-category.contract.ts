export const VARIANCE_CATEGORIES = [
  "price",
  "quantity",
  "mix",
  "rate",
] as const;

export type VarianceCategory = (typeof VARIANCE_CATEGORIES)[number];

export function isVarianceCategory(value: string): value is VarianceCategory {
  return (VARIANCE_CATEGORIES as readonly string[]).includes(value);
}
