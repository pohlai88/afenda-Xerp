export const IC_BILLING_DIRECTIONS = [
  "outbound",
  "inbound",
  "bilateral",
] as const;

export type IcBillingDirection = (typeof IC_BILLING_DIRECTIONS)[number];

export function isIcBillingDirection(
  value: string
): value is IcBillingDirection {
  return (IC_BILLING_DIRECTIONS as readonly string[]).includes(value);
}
