export const TAX_PERMISSION_DOMAINS = [
  "declaration",
  "withholding",
  "determination",
] as const;

export type TaxPermissionDomain = (typeof TAX_PERMISSION_DOMAINS)[number];

export const TAX_PERMISSION_ACTIONS = {
  declaration: ["read", "create", "submit", "approve"] as const,
  withholding: ["read", "manage"] as const,
  determination: ["read", "manage"] as const,
} as const satisfies Record<TaxPermissionDomain, readonly string[]>;

export type TaxPermissionAction<
  TDomain extends TaxPermissionDomain = TaxPermissionDomain,
> = (typeof TAX_PERMISSION_ACTIONS)[TDomain][number];

export function toTaxPermissionKey(
  domain: TaxPermissionDomain,
  action: TaxPermissionAction
): string {
  return `tax.${domain}_${action}`;
}

export const TAX_PERMISSION_KEY_VOCABULARY = [
  toTaxPermissionKey("declaration", "read"),
  toTaxPermissionKey("declaration", "create"),
  toTaxPermissionKey("declaration", "submit"),
  toTaxPermissionKey("declaration", "approve"),
  toTaxPermissionKey("withholding", "read"),
  toTaxPermissionKey("withholding", "manage"),
  toTaxPermissionKey("determination", "read"),
  toTaxPermissionKey("determination", "manage"),
] as const;

export type TaxPermissionKey = (typeof TAX_PERMISSION_KEY_VOCABULARY)[number];
