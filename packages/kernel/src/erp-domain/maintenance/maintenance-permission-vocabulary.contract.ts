export const MAINTENANCE_PERMISSION_DOMAINS = [
  "maintenanceOrder",
  "workRequest",
  "downtime",
] as const;

export type MaintenancePermissionDomain =
  (typeof MAINTENANCE_PERMISSION_DOMAINS)[number];

export const MAINTENANCE_PERMISSION_ACTIONS = {
  maintenanceOrder: ["read", "create", "approve", "close"] as const,
  workRequest: ["read", "create", "cancel"] as const,
  downtime: ["read", "manage"] as const,
} as const satisfies Record<MaintenancePermissionDomain, readonly string[]>;

export type MaintenancePermissionAction<
  TDomain extends MaintenancePermissionDomain = MaintenancePermissionDomain,
> = (typeof MAINTENANCE_PERMISSION_ACTIONS)[TDomain][number];

export function toMaintenancePermissionKey(
  domain: MaintenancePermissionDomain,
  action: MaintenancePermissionAction
): string {
  return `maintenance.${domain}_${action}`;
}

export const MAINTENANCE_PERMISSION_KEY_VOCABULARY = [
  toMaintenancePermissionKey("maintenanceOrder", "read"),
  toMaintenancePermissionKey("maintenanceOrder", "create"),
  toMaintenancePermissionKey("maintenanceOrder", "approve"),
  toMaintenancePermissionKey("maintenanceOrder", "close"),
  toMaintenancePermissionKey("workRequest", "read"),
  toMaintenancePermissionKey("workRequest", "create"),
  toMaintenancePermissionKey("workRequest", "cancel"),
  toMaintenancePermissionKey("downtime", "read"),
  toMaintenancePermissionKey("downtime", "manage"),
] as const;

export type MaintenancePermissionKey =
  (typeof MAINTENANCE_PERMISSION_KEY_VOCABULARY)[number];
