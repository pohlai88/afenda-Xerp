export const SERVICE_AUDIT_ACTIONS = [
  "case.opened",
  "case.resolved",
  "case.closed",
  "visit.completed",
] as const;

export type ServiceAuditAction = (typeof SERVICE_AUDIT_ACTIONS)[number];

export function isServiceAuditAction(
  value: string
): value is ServiceAuditAction {
  return (SERVICE_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseServiceAuditAction(
  value: string
): ServiceAuditAction | null {
  return isServiceAuditAction(value) ? value : null;
}
