export const MAINTENANCE_ORDER_TYPES = [
  "corrective",
  "preventive",
  "predictive",
  "emergency",
] as const;

export type MaintenanceOrderType = (typeof MAINTENANCE_ORDER_TYPES)[number];

export function isMaintenanceOrderType(
  value: string
): value is MaintenanceOrderType {
  return (MAINTENANCE_ORDER_TYPES as readonly string[]).includes(value);
}
