export const SUBSCRIPTION_EVENT_TYPES = [
  "activate",
  "renew",
  "upgrade",
  "downgrade",
  "cancel",
] as const;

export type SubscriptionEventType = (typeof SUBSCRIPTION_EVENT_TYPES)[number];

export function isSubscriptionEventType(
  value: string
): value is SubscriptionEventType {
  return (SUBSCRIPTION_EVENT_TYPES as readonly string[]).includes(value);
}
