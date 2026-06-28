export const FIELD_SERVICE_AUDIT_ACTIONS = [
  "work_order.dispatched",
  "visit.completed",
  "route.started",
  "visit.rescheduled",
] as const;

export type FieldServiceAuditAction =
  (typeof FIELD_SERVICE_AUDIT_ACTIONS)[number];

export function isFieldServiceAuditAction(
  value: string
): value is FieldServiceAuditAction {
  return (FIELD_SERVICE_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseFieldServiceAuditAction(
  value: string
): FieldServiceAuditAction | null {
  return isFieldServiceAuditAction(value) ? value : null;
}
