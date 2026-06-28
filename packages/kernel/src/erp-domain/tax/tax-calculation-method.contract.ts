export const TAX_CALCULATION_METHODS = [
  "standard",
  "reverse_charge",
  "exempt",
  "zero_rated",
] as const;

export type TaxCalculationMethod = (typeof TAX_CALCULATION_METHODS)[number];

export function isTaxCalculationMethod(
  value: string
): value is TaxCalculationMethod {
  return (TAX_CALCULATION_METHODS as readonly string[]).includes(value);
}
