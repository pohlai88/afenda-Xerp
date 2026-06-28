export const PRICING_METHODS = [
  "cost_plus",
  "market",
  "tiered",
  "dynamic",
] as const;

export type PricingMethod = (typeof PRICING_METHODS)[number];

export function isPricingMethod(value: string): value is PricingMethod {
  return (PRICING_METHODS as readonly string[]).includes(value);
}
