export const PRICING_PERMISSION_DOMAINS = [
  "priceList",
  "priceRule",
  "discount",
] as const;

export type PricingPermissionDomain =
  (typeof PRICING_PERMISSION_DOMAINS)[number];

export const PRICING_PERMISSION_ACTIONS = {
  priceList: ["read", "manage"] as const,
  priceRule: ["read", "create", "approve"] as const,
  discount: ["read", "approve"] as const,
} as const satisfies Record<PricingPermissionDomain, readonly string[]>;

export type PricingPermissionAction<
  TDomain extends PricingPermissionDomain = PricingPermissionDomain,
> = (typeof PRICING_PERMISSION_ACTIONS)[TDomain][number];

export function toPricingPermissionKey(
  domain: PricingPermissionDomain,
  action: PricingPermissionAction
): string {
  return `pricing.${domain}_${action}`;
}

export const PRICING_PERMISSION_KEY_VOCABULARY = [
  toPricingPermissionKey("priceList", "read"),
  toPricingPermissionKey("priceList", "manage"),
  toPricingPermissionKey("priceRule", "read"),
  toPricingPermissionKey("priceRule", "create"),
  toPricingPermissionKey("priceRule", "approve"),
  toPricingPermissionKey("discount", "read"),
  toPricingPermissionKey("discount", "approve"),
] as const;

export type PricingPermissionKey =
  (typeof PRICING_PERMISSION_KEY_VOCABULARY)[number];
