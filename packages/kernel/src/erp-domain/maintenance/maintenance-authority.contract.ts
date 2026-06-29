/**
 * PAS-001B B88 — Maintenance domain authority (kernel contracts-only lifecycle).
 */

export const MAINTENANCE_AUTHORITY_PAS = "PAS-001B" as const;

export const MAINTENANCE_REGISTRY_ID =
  "PKGR01B_MAINTENANCE_VOCABULARY" as const;

export const MAINTENANCE_MODULE_KV_ID = "KV-PM" as const;

export const MAINTENANCE_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/maintenance" as const;

export const MAINTENANCE_AUTHORITY_FINGERPRINT =
  "MAINTENANCE-AUTHORITY-2026-06-28-v1" as const;

export const MAINTENANCE_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type MaintenancePackageLifecyclePhase =
  (typeof MAINTENANCE_PACKAGE_LIFECYCLE_PHASES)[number];

export const MAINTENANCE_PACKAGE_LIFECYCLE: MaintenancePackageLifecyclePhase =
  "contracts-only";

export function isMaintenancePackageLifecyclePhase(
  value: string
): value is MaintenancePackageLifecyclePhase {
  return (MAINTENANCE_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
