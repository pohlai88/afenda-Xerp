export const HCM_PERMISSION_DOMAINS = [
  "requisition",
  "onboarding",
  "review",
] as const;

export type HcmPermissionDomain = (typeof HCM_PERMISSION_DOMAINS)[number];

export const HCM_PERMISSION_ACTIONS = {
  requisition: ["read", "create", "approve", "cancel"] as const,
  onboarding: ["read", "manage"] as const,
  review: ["read", "create", "close"] as const,
} as const satisfies Record<HcmPermissionDomain, readonly string[]>;

export type HcmPermissionAction<
  TDomain extends HcmPermissionDomain = HcmPermissionDomain,
> = (typeof HCM_PERMISSION_ACTIONS)[TDomain][number];

export function toHcmPermissionKey(
  domain: HcmPermissionDomain,
  action: HcmPermissionAction
): string {
  return `hcm.${domain}_${action}`;
}

export const HCM_PERMISSION_KEY_VOCABULARY = [
  toHcmPermissionKey("requisition", "read"),
  toHcmPermissionKey("requisition", "create"),
  toHcmPermissionKey("requisition", "approve"),
  toHcmPermissionKey("requisition", "cancel"),
  toHcmPermissionKey("onboarding", "read"),
  toHcmPermissionKey("onboarding", "manage"),
  toHcmPermissionKey("review", "read"),
  toHcmPermissionKey("review", "create"),
  toHcmPermissionKey("review", "close"),
] as const;

export type HcmPermissionKey = (typeof HCM_PERMISSION_KEY_VOCABULARY)[number];
