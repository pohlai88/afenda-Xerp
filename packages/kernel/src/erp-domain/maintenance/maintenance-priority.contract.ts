export const MAINTENANCE_PRIORITIES = [
  "routine",
  "urgent",
  "critical",
  "shutdown",
] as const;

export type MaintenancePriority = (typeof MAINTENANCE_PRIORITIES)[number];

export function isMaintenancePriority(
  value: string
): value is MaintenancePriority {
  return (MAINTENANCE_PRIORITIES as readonly string[]).includes(value);
}
