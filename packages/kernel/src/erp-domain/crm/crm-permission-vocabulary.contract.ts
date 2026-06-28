export const CRM_PERMISSION_DOMAINS = [
  "lead",
  "opportunity",
  "activity",
] as const;

export type CrmPermissionDomain = (typeof CRM_PERMISSION_DOMAINS)[number];

export const CRM_PERMISSION_ACTIONS = {
  lead: ["read", "create", "manage"] as const,
  opportunity: ["read", "create", "close"] as const,
  activity: ["read", "create"] as const,
} as const satisfies Record<CrmPermissionDomain, readonly string[]>;

export type CrmPermissionAction<
  TDomain extends CrmPermissionDomain = CrmPermissionDomain,
> = (typeof CRM_PERMISSION_ACTIONS)[TDomain][number];

export function toCrmPermissionKey(
  domain: CrmPermissionDomain,
  action: CrmPermissionAction
): string {
  return `crm.${domain}_${action}`;
}

export const CRM_PERMISSION_KEY_VOCABULARY = [
  toCrmPermissionKey("lead", "read"),
  toCrmPermissionKey("lead", "create"),
  toCrmPermissionKey("lead", "manage"),
  toCrmPermissionKey("opportunity", "read"),
  toCrmPermissionKey("opportunity", "create"),
  toCrmPermissionKey("opportunity", "close"),
  toCrmPermissionKey("activity", "read"),
  toCrmPermissionKey("activity", "create"),
] as const;

export type CrmPermissionKey = (typeof CRM_PERMISSION_KEY_VOCABULARY)[number];
