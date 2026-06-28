export const MAINTENANCE_AUDIT_ACTIONS = [
  "order.scheduled",
  "order.completed",
  "downtime.recorded",
  "request.created",
] as const;

export type MaintenanceAuditAction = (typeof MAINTENANCE_AUDIT_ACTIONS)[number];

export function isMaintenanceAuditAction(
  value: string
): value is MaintenanceAuditAction {
  return (MAINTENANCE_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseMaintenanceAuditAction(
  value: string
): MaintenanceAuditAction | null {
  return isMaintenanceAuditAction(value) ? value : null;
}
