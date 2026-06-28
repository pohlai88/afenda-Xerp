export const INTERCOMPANY_PERMISSION_DOMAINS = [
  "agreement",
  "matching",
  "settlement",
] as const;

export type IntercompanyPermissionDomain =
  (typeof INTERCOMPANY_PERMISSION_DOMAINS)[number];

export const INTERCOMPANY_PERMISSION_ACTIONS = {
  agreement: ["read", "manage"] as const,
  matching: ["read", "create", "approve"] as const,
  settlement: ["read", "create", "close"] as const,
} as const satisfies Record<IntercompanyPermissionDomain, readonly string[]>;

export type IntercompanyPermissionAction<
  TDomain extends IntercompanyPermissionDomain = IntercompanyPermissionDomain,
> = (typeof INTERCOMPANY_PERMISSION_ACTIONS)[TDomain][number];

export function toIntercompanyPermissionKey(
  domain: IntercompanyPermissionDomain,
  action: IntercompanyPermissionAction
): string {
  return `intercompany.${domain}_${action}`;
}

export const INTERCOMPANY_PERMISSION_KEY_VOCABULARY = [
  toIntercompanyPermissionKey("agreement", "read"),
  toIntercompanyPermissionKey("agreement", "manage"),
  toIntercompanyPermissionKey("matching", "read"),
  toIntercompanyPermissionKey("matching", "create"),
  toIntercompanyPermissionKey("matching", "approve"),
  toIntercompanyPermissionKey("settlement", "read"),
  toIntercompanyPermissionKey("settlement", "create"),
  toIntercompanyPermissionKey("settlement", "close"),
] as const;

export type IntercompanyPermissionKey =
  (typeof INTERCOMPANY_PERMISSION_KEY_VOCABULARY)[number];
