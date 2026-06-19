export const RESERVED_AUDIT_ACTIONS = [
  "permission.granted",
  "permission.revoked",
  "role.assigned",
  "role.removed",
  "feature.enabled",
  "feature.disabled",
  "journal.posted",
  "journal.reversed",
  "period.closed",
  "period.reopened",
  "approval.requested",
  "approval.approved",
  "approval.rejected",
  "approval.escalated",
  "ai.query.executed",
  "ai.action.blocked",
  "ai.draft.created",
  "tenant.created",
  "integration.failed",
  "configuration.changed",
] as const;

export type ReservedAuditAction = (typeof RESERVED_AUDIT_ACTIONS)[number];
