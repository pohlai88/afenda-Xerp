export const MAINTENANCE_ORDER_STATUSES = [
  "draft",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type MaintenanceOrderStatus =
  (typeof MAINTENANCE_ORDER_STATUSES)[number];

export function isMaintenanceOrderStatus(
  value: string
): value is MaintenanceOrderStatus {
  return (MAINTENANCE_ORDER_STATUSES as readonly string[]).includes(value);
}
