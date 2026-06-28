export const CHECKOUT_STEPS = [
  "cart",
  "shipping",
  "payment",
  "review",
  "complete",
] as const;

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number];

export function isCheckoutStep(value: string): value is CheckoutStep {
  return (CHECKOUT_STEPS as readonly string[]).includes(value);
}
