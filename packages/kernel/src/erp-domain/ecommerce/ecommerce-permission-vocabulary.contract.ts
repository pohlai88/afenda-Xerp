/**
 * Ecommerce permission vocabulary — documents domains/actions for PERMISSION_REGISTRY parity.
 */
export const ECOMMERCE_PERMISSION_DOMAINS = [
  "webCart",
  "checkoutSession",
  "webOrder",
] as const;

export type EcommercePermissionDomain =
  (typeof ECOMMERCE_PERMISSION_DOMAINS)[number];

export const ECOMMERCE_PERMISSION_ACTIONS = {
  webCart: ["read", "create", "update", "abandon", "merge"] as const,
  checkoutSession: ["read", "start", "advance", "complete", "cancel"] as const,
  webOrder: ["read", "place", "pay", "fulfill", "refund"] as const,
} as const satisfies Record<EcommercePermissionDomain, readonly string[]>;

export type EcommercePermissionAction<
  TDomain extends EcommercePermissionDomain = EcommercePermissionDomain,
> = (typeof ECOMMERCE_PERMISSION_ACTIONS)[TDomain][number];

export function toEcommercePermissionKey(
  domain: EcommercePermissionDomain,
  action: EcommercePermissionAction
): string {
  return `ecommerce.${domain}_${action}`;
}

export const ECOMMERCE_PERMISSION_KEY_VOCABULARY = [
  toEcommercePermissionKey("webCart", "read"),
  toEcommercePermissionKey("webCart", "create"),
  toEcommercePermissionKey("webCart", "update"),
  toEcommercePermissionKey("webCart", "abandon"),
  toEcommercePermissionKey("webCart", "merge"),
  toEcommercePermissionKey("checkoutSession", "read"),
  toEcommercePermissionKey("checkoutSession", "start"),
  toEcommercePermissionKey("checkoutSession", "advance"),
  toEcommercePermissionKey("checkoutSession", "complete"),
  toEcommercePermissionKey("checkoutSession", "cancel"),
  toEcommercePermissionKey("webOrder", "read"),
  toEcommercePermissionKey("webOrder", "place"),
  toEcommercePermissionKey("webOrder", "pay"),
  toEcommercePermissionKey("webOrder", "fulfill"),
  toEcommercePermissionKey("webOrder", "refund"),
] as const;

export type EcommercePermissionKey =
  (typeof ECOMMERCE_PERMISSION_KEY_VOCABULARY)[number];
