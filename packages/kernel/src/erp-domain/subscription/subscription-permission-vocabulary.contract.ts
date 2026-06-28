export const SUBSCRIPTION_PERMISSION_DOMAINS = [
  "subscription",
  "billingCycle",
  "renewal",
] as const;

export type SubscriptionPermissionDomain =
  (typeof SUBSCRIPTION_PERMISSION_DOMAINS)[number];

export const SUBSCRIPTION_PERMISSION_ACTIONS = {
  subscription: ["read", "create", "cancel"] as const,
  billingCycle: ["read", "manage"] as const,
  renewal: ["read", "manage"] as const,
} as const satisfies Record<SubscriptionPermissionDomain, readonly string[]>;

export type SubscriptionPermissionAction<
  TDomain extends SubscriptionPermissionDomain = SubscriptionPermissionDomain,
> = (typeof SUBSCRIPTION_PERMISSION_ACTIONS)[TDomain][number];

export function toSubscriptionPermissionKey(
  domain: SubscriptionPermissionDomain,
  action: SubscriptionPermissionAction
): string {
  return `subscription.${domain}_${action}`;
}

export const SUBSCRIPTION_PERMISSION_KEY_VOCABULARY = [
  toSubscriptionPermissionKey("subscription", "read"),
  toSubscriptionPermissionKey("subscription", "create"),
  toSubscriptionPermissionKey("subscription", "cancel"),
  toSubscriptionPermissionKey("billingCycle", "read"),
  toSubscriptionPermissionKey("billingCycle", "manage"),
  toSubscriptionPermissionKey("renewal", "read"),
  toSubscriptionPermissionKey("renewal", "manage"),
] as const;

export type SubscriptionPermissionKey =
  (typeof SUBSCRIPTION_PERMISSION_KEY_VOCABULARY)[number];
