export const PROJECT_AUDIT_ACTIONS = [
  "project.started",
  "project.completed",
  "timesheet.approved",
  "task.completed",
] as const;

export type ProjectAuditAction = (typeof PROJECT_AUDIT_ACTIONS)[number];

export function isProjectAuditAction(
  value: string
): value is ProjectAuditAction {
  return (PROJECT_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseProjectAuditAction(
  value: string
): ProjectAuditAction | null {
  return isProjectAuditAction(value) ? value : null;
}
