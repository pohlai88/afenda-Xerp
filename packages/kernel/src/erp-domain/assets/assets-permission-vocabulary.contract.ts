export const ASSETS_PERMISSION_DOMAINS = [
  "asset",
  "depreciation",
  "transfer",
] as const;

export type AssetsPermissionDomain = (typeof ASSETS_PERMISSION_DOMAINS)[number];

export const ASSETS_PERMISSION_ACTIONS = {
  asset: ["read", "create", "manage"] as const,
  depreciation: ["read", "create", "approve"] as const,
  transfer: ["read", "create", "approve"] as const,
} as const satisfies Record<AssetsPermissionDomain, readonly string[]>;

export type AssetsPermissionAction<
  TDomain extends AssetsPermissionDomain = AssetsPermissionDomain,
> = (typeof ASSETS_PERMISSION_ACTIONS)[TDomain][number];

export function toAssetsPermissionKey(
  domain: AssetsPermissionDomain,
  action: AssetsPermissionAction
): string {
  return `assets.${domain}_${action}`;
}

export const ASSETS_PERMISSION_KEY_VOCABULARY = [
  toAssetsPermissionKey("asset", "read"),
  toAssetsPermissionKey("asset", "create"),
  toAssetsPermissionKey("asset", "manage"),
  toAssetsPermissionKey("depreciation", "read"),
  toAssetsPermissionKey("depreciation", "create"),
  toAssetsPermissionKey("depreciation", "approve"),
  toAssetsPermissionKey("transfer", "read"),
  toAssetsPermissionKey("transfer", "create"),
  toAssetsPermissionKey("transfer", "approve"),
] as const;

export type AssetsPermissionKey =
  (typeof ASSETS_PERMISSION_KEY_VOCABULARY)[number];
