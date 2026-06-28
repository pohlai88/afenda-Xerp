export const CONTROLLING_PERMISSION_DOMAINS = [
  "costElement",
  "allocation",
  "variance",
] as const;

export type ControllingPermissionDomain =
  (typeof CONTROLLING_PERMISSION_DOMAINS)[number];

export const CONTROLLING_PERMISSION_ACTIONS = {
  costElement: ["read", "manage"] as const,
  allocation: ["read", "create", "approve"] as const,
  variance: ["read", "manage"] as const,
} as const satisfies Record<ControllingPermissionDomain, readonly string[]>;

export type ControllingPermissionAction<
  TDomain extends ControllingPermissionDomain = ControllingPermissionDomain,
> = (typeof CONTROLLING_PERMISSION_ACTIONS)[TDomain][number];

export function toControllingPermissionKey(
  domain: ControllingPermissionDomain,
  action: ControllingPermissionAction
): string {
  return `controlling.${domain}_${action}`;
}

export const CONTROLLING_PERMISSION_KEY_VOCABULARY = [
  toControllingPermissionKey("costElement", "read"),
  toControllingPermissionKey("costElement", "manage"),
  toControllingPermissionKey("allocation", "read"),
  toControllingPermissionKey("allocation", "create"),
  toControllingPermissionKey("allocation", "approve"),
  toControllingPermissionKey("variance", "read"),
  toControllingPermissionKey("variance", "manage"),
] as const;

export type ControllingPermissionKey =
  (typeof CONTROLLING_PERMISSION_KEY_VOCABULARY)[number];
