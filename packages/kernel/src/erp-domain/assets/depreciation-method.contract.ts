export const DEPRECIATION_METHODS = [
  "straight_line",
  "declining_balance",
  "units_of_production",
] as const;

export type DepreciationMethod = (typeof DEPRECIATION_METHODS)[number];

export function isDepreciationMethod(
  value: string
): value is DepreciationMethod {
  return (DEPRECIATION_METHODS as readonly string[]).includes(value);
}
