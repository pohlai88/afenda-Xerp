export const QUALITY_AUDIT_ACTIONS = [
  "inspection.completed",
  "notification.opened",
  "disposition.applied",
  "lot.sampled",
] as const;

export type QualityAuditAction = (typeof QUALITY_AUDIT_ACTIONS)[number];

export function isQualityAuditAction(
  value: string
): value is QualityAuditAction {
  return (QUALITY_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseQualityAuditAction(
  value: string
): QualityAuditAction | null {
  return isQualityAuditAction(value) ? value : null;
}
