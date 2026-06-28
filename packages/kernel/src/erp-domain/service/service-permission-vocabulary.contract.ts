export const SERVICE_PERMISSION_DOMAINS = [
  "case",
  "contract",
  "visit",
] as const;

export type ServicePermissionDomain =
  (typeof SERVICE_PERMISSION_DOMAINS)[number];

export const SERVICE_PERMISSION_ACTIONS = {
  case: ["read", "create", "close"] as const,
  contract: ["read", "manage"] as const,
  visit: ["read", "create"] as const,
} as const satisfies Record<ServicePermissionDomain, readonly string[]>;

export type ServicePermissionAction<
  TDomain extends ServicePermissionDomain = ServicePermissionDomain,
> = (typeof SERVICE_PERMISSION_ACTIONS)[TDomain][number];

export function toServicePermissionKey(
  domain: ServicePermissionDomain,
  action: ServicePermissionAction
): string {
  return `service.${domain}_${action}`;
}

export const SERVICE_PERMISSION_KEY_VOCABULARY = [
  toServicePermissionKey("case", "read"),
  toServicePermissionKey("case", "create"),
  toServicePermissionKey("case", "close"),
  toServicePermissionKey("contract", "read"),
  toServicePermissionKey("contract", "manage"),
  toServicePermissionKey("visit", "read"),
  toServicePermissionKey("visit", "create"),
] as const;

export type ServicePermissionKey =
  (typeof SERVICE_PERMISSION_KEY_VOCABULARY)[number];
