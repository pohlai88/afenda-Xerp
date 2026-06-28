export const PRICING_CONTEXTS = [
  "list",
  "customer",
  "campaign",
  "contract",
] as const;

export type PricingContext = (typeof PRICING_CONTEXTS)[number];

export function isPricingContext(value: string): value is PricingContext {
  return (PRICING_CONTEXTS as readonly string[]).includes(value);
}
