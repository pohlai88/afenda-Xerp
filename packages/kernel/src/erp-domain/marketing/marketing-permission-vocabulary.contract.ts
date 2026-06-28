export const MARKETING_PERMISSION_DOMAINS = [
  "campaign",
  "segment",
  "content",
] as const;

export type MarketingPermissionDomain =
  (typeof MARKETING_PERMISSION_DOMAINS)[number];

export const MARKETING_PERMISSION_ACTIONS = {
  campaign: ["read", "create", "manage"] as const,
  segment: ["read", "manage"] as const,
  content: ["read", "manage"] as const,
} as const satisfies Record<MarketingPermissionDomain, readonly string[]>;

export type MarketingPermissionAction<
  TDomain extends MarketingPermissionDomain = MarketingPermissionDomain,
> = (typeof MARKETING_PERMISSION_ACTIONS)[TDomain][number];

export function toMarketingPermissionKey(
  domain: MarketingPermissionDomain,
  action: MarketingPermissionAction
): string {
  return `marketing.${domain}_${action}`;
}

export const MARKETING_PERMISSION_KEY_VOCABULARY = [
  toMarketingPermissionKey("campaign", "read"),
  toMarketingPermissionKey("campaign", "create"),
  toMarketingPermissionKey("campaign", "manage"),
  toMarketingPermissionKey("segment", "read"),
  toMarketingPermissionKey("segment", "manage"),
  toMarketingPermissionKey("content", "read"),
  toMarketingPermissionKey("content", "manage"),
] as const;

export type MarketingPermissionKey =
  (typeof MARKETING_PERMISSION_KEY_VOCABULARY)[number];
