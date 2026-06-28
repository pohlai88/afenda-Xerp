export const BILLING_CYCLES = [
  "monthly",
  "quarterly",
  "annual",
  "usage",
] as const;

export type BillingCycle = (typeof BILLING_CYCLES)[number];

export function isBillingCycle(value: string): value is BillingCycle {
  return (BILLING_CYCLES as readonly string[]).includes(value);
}
