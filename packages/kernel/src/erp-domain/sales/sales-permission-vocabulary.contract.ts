export const SALES_PERMISSION_DOMAINS = [
  "salesOrder",
  "quote",
  "schedule",
] as const;

export type SalesPermissionDomain = (typeof SALES_PERMISSION_DOMAINS)[number];

export const SALES_PERMISSION_ACTIONS = {
  salesOrder: ["read", "create", "approve", "cancel"] as const,
  quote: ["read", "create", "send"] as const,
  schedule: ["read", "manage"] as const,
} as const satisfies Record<SalesPermissionDomain, readonly string[]>;

export type SalesPermissionAction<
  TDomain extends SalesPermissionDomain = SalesPermissionDomain,
> = (typeof SALES_PERMISSION_ACTIONS)[TDomain][number];

export function toSalesPermissionKey(
  domain: SalesPermissionDomain,
  action: SalesPermissionAction
): string {
  return `sales.${domain}_${action}`;
}

export const SALES_PERMISSION_KEY_VOCABULARY = [
  toSalesPermissionKey("salesOrder", "read"),
  toSalesPermissionKey("salesOrder", "create"),
  toSalesPermissionKey("salesOrder", "approve"),
  toSalesPermissionKey("salesOrder", "cancel"),
  toSalesPermissionKey("quote", "read"),
  toSalesPermissionKey("quote", "create"),
  toSalesPermissionKey("quote", "send"),
  toSalesPermissionKey("schedule", "read"),
  toSalesPermissionKey("schedule", "manage"),
] as const;

export type SalesPermissionKey =
  (typeof SALES_PERMISSION_KEY_VOCABULARY)[number];
