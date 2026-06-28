export const BILLING_METHODS = [
  "fixed",
  "time_and_materials",
  "milestone",
  "retainer",
] as const;

export type BillingMethod = (typeof BILLING_METHODS)[number];

export function isBillingMethod(value: string): value is BillingMethod {
  return (BILLING_METHODS as readonly string[]).includes(value);
}
