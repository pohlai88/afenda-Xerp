export const CONTROLLING_AUDIT_ACTIONS = [
  "allocation.drafted",
  "allocation.posted",
  "variance.calculated",
  "plan.updated",
] as const;

export type ControllingAuditAction = (typeof CONTROLLING_AUDIT_ACTIONS)[number];

export function isControllingAuditAction(
  value: string
): value is ControllingAuditAction {
  return (CONTROLLING_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseControllingAuditAction(
  value: string
): ControllingAuditAction | null {
  return isControllingAuditAction(value) ? value : null;
}
