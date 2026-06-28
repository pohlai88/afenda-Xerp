export const QUALITY_PERMISSION_DOMAINS = [
  "inspection",
  "notification",
  "sampleLot",
] as const;

export type QualityPermissionDomain =
  (typeof QUALITY_PERMISSION_DOMAINS)[number];

export const QUALITY_PERMISSION_ACTIONS = {
  inspection: ["read", "create", "approve", "cancel"] as const,
  notification: ["read", "manage"] as const,
  sampleLot: ["read", "manage"] as const,
} as const satisfies Record<QualityPermissionDomain, readonly string[]>;

export type QualityPermissionAction<
  TDomain extends QualityPermissionDomain = QualityPermissionDomain,
> = (typeof QUALITY_PERMISSION_ACTIONS)[TDomain][number];

export function toQualityPermissionKey(
  domain: QualityPermissionDomain,
  action: QualityPermissionAction
): string {
  return `quality.${domain}_${action}`;
}

export const QUALITY_PERMISSION_KEY_VOCABULARY = [
  toQualityPermissionKey("inspection", "read"),
  toQualityPermissionKey("inspection", "create"),
  toQualityPermissionKey("inspection", "approve"),
  toQualityPermissionKey("inspection", "cancel"),
  toQualityPermissionKey("notification", "read"),
  toQualityPermissionKey("notification", "manage"),
  toQualityPermissionKey("sampleLot", "read"),
  toQualityPermissionKey("sampleLot", "manage"),
] as const;

export type QualityPermissionKey =
  (typeof QUALITY_PERMISSION_KEY_VOCABULARY)[number];
