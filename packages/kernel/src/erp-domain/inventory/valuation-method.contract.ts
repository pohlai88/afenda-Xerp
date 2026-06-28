/** Inventory valuation method labels — policy words only. */
export const VALUATION_METHODS = [
  "standard",
  "fifo",
  "lifo",
  "average",
] as const;

export type ValuationMethod = (typeof VALUATION_METHODS)[number];

export function isValuationMethod(value: string): value is ValuationMethod {
  return (VALUATION_METHODS as readonly string[]).includes(value);
}
