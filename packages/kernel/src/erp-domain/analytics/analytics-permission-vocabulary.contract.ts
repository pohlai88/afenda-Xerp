export const ANALYTICS_PERMISSION_DOMAINS = [
  "query",
  "dashboard",
  "metric",
] as const;

export type AnalyticsPermissionDomain =
  (typeof ANALYTICS_PERMISSION_DOMAINS)[number];

export const ANALYTICS_PERMISSION_ACTIONS = {
  query: ["read", "create", "manage"] as const,
  dashboard: ["read", "manage"] as const,
  metric: ["read", "manage"] as const,
} as const satisfies Record<AnalyticsPermissionDomain, readonly string[]>;

export type AnalyticsPermissionAction<
  TDomain extends AnalyticsPermissionDomain = AnalyticsPermissionDomain,
> = (typeof ANALYTICS_PERMISSION_ACTIONS)[TDomain][number];

export function toAnalyticsPermissionKey(
  domain: AnalyticsPermissionDomain,
  action: AnalyticsPermissionAction
): string {
  return `analytics.${domain}_${action}`;
}

export const ANALYTICS_PERMISSION_KEY_VOCABULARY = [
  toAnalyticsPermissionKey("query", "read"),
  toAnalyticsPermissionKey("query", "create"),
  toAnalyticsPermissionKey("query", "manage"),
  toAnalyticsPermissionKey("dashboard", "read"),
  toAnalyticsPermissionKey("dashboard", "manage"),
  toAnalyticsPermissionKey("metric", "read"),
  toAnalyticsPermissionKey("metric", "manage"),
] as const;

export type AnalyticsPermissionKey =
  (typeof ANALYTICS_PERMISSION_KEY_VOCABULARY)[number];
