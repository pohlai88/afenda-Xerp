export const COST_ELEMENT_CATEGORIES = [
  "primary",
  "secondary",
  "revenue",
  "statistical",
] as const;

export type CostElementCategory = (typeof COST_ELEMENT_CATEGORIES)[number];

export function isCostElementCategory(
  value: string
): value is CostElementCategory {
  return (COST_ELEMENT_CATEGORIES as readonly string[]).includes(value);
}
