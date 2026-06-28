export const TREASURY_PERMISSION_DOMAINS = [
  "cashPosition",
  "paymentRun",
  "hedge",
] as const;

export type TreasuryPermissionDomain =
  (typeof TREASURY_PERMISSION_DOMAINS)[number];

export const TREASURY_PERMISSION_ACTIONS = {
  cashPosition: ["read", "manage"] as const,
  paymentRun: ["read", "create", "approve", "cancel"] as const,
  hedge: ["read", "manage"] as const,
} as const satisfies Record<TreasuryPermissionDomain, readonly string[]>;

export type TreasuryPermissionAction<
  TDomain extends TreasuryPermissionDomain = TreasuryPermissionDomain,
> = (typeof TREASURY_PERMISSION_ACTIONS)[TDomain][number];

export function toTreasuryPermissionKey(
  domain: TreasuryPermissionDomain,
  action: TreasuryPermissionAction
): string {
  return `treasury.${domain}_${action}`;
}

export const TREASURY_PERMISSION_KEY_VOCABULARY = [
  toTreasuryPermissionKey("cashPosition", "read"),
  toTreasuryPermissionKey("cashPosition", "manage"),
  toTreasuryPermissionKey("paymentRun", "read"),
  toTreasuryPermissionKey("paymentRun", "create"),
  toTreasuryPermissionKey("paymentRun", "approve"),
  toTreasuryPermissionKey("paymentRun", "cancel"),
  toTreasuryPermissionKey("hedge", "read"),
  toTreasuryPermissionKey("hedge", "manage"),
] as const;

export type TreasuryPermissionKey =
  (typeof TREASURY_PERMISSION_KEY_VOCABULARY)[number];
