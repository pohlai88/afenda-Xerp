export const SUBSCRIPTION_AUDIT_ACTIONS = [
  "subscription.activated",
  "subscription.cancelled",
  "renewal.offered",
  "cycle.billed",
] as const;

export type SubscriptionAuditAction =
  (typeof SUBSCRIPTION_AUDIT_ACTIONS)[number];

export function isSubscriptionAuditAction(
  value: string
): value is SubscriptionAuditAction {
  return (SUBSCRIPTION_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseSubscriptionAuditAction(
  value: string
): SubscriptionAuditAction | null {
  return isSubscriptionAuditAction(value) ? value : null;
}
