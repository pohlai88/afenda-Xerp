export const POS_PERMISSION_DOMAINS = [
  "session",
  "transaction",
  "shift",
] as const;

export type PosPermissionDomain = (typeof POS_PERMISSION_DOMAINS)[number];

export const POS_PERMISSION_ACTIONS = {
  session: ["read", "create", "close"] as const,
  transaction: ["read", "create", "cancel"] as const,
  shift: ["read", "manage"] as const,
} as const satisfies Record<PosPermissionDomain, readonly string[]>;

export type PosPermissionAction<
  TDomain extends PosPermissionDomain = PosPermissionDomain,
> = (typeof POS_PERMISSION_ACTIONS)[TDomain][number];

export function toPosPermissionKey(
  domain: PosPermissionDomain,
  action: PosPermissionAction
): string {
  return `pos.${domain}_${action}`;
}

export const POS_PERMISSION_KEY_VOCABULARY = [
  toPosPermissionKey("session", "read"),
  toPosPermissionKey("session", "create"),
  toPosPermissionKey("session", "close"),
  toPosPermissionKey("transaction", "read"),
  toPosPermissionKey("transaction", "create"),
  toPosPermissionKey("transaction", "cancel"),
  toPosPermissionKey("shift", "read"),
  toPosPermissionKey("shift", "manage"),
] as const;

export type PosPermissionKey = (typeof POS_PERMISSION_KEY_VOCABULARY)[number];
