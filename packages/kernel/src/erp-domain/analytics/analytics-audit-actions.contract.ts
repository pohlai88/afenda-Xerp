export const ANALYTICS_AUDIT_ACTIONS = [
  "query.validated",
  "dashboard.published",
  "metric.snapshot_created",
  "query.failed",
] as const;

export type AnalyticsAuditAction = (typeof ANALYTICS_AUDIT_ACTIONS)[number];

export function isAnalyticsAuditAction(
  value: string
): value is AnalyticsAuditAction {
  return (ANALYTICS_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseAnalyticsAuditAction(
  value: string
): AnalyticsAuditAction | null {
  return isAnalyticsAuditAction(value) ? value : null;
}
