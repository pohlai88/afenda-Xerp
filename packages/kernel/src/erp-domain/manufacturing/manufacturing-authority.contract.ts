/**
 * PAS-001B B86 — Manufacturing domain authority (kernel contracts-only lifecycle).
 */

export const MANUFACTURING_AUTHORITY_PAS = "PAS-001B" as const;

export const MANUFACTURING_REGISTRY_ID =
  "PKGR01B_MANUFACTURING_VOCABULARY" as const;

export const MANUFACTURING_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/manufacturing" as const;

export const MANUFACTURING_AUTHORITY_FINGERPRINT =
  "MANUFACTURING-AUTHORITY-2026-06-28-v1" as const;

export const MANUFACTURING_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type ManufacturingPackageLifecyclePhase =
  (typeof MANUFACTURING_PACKAGE_LIFECYCLE_PHASES)[number];

export const MANUFACTURING_PACKAGE_LIFECYCLE: ManufacturingPackageLifecyclePhase =
  "contracts-only";

export function isManufacturingPackageLifecyclePhase(
  value: string
): value is ManufacturingPackageLifecyclePhase {
  return (MANUFACTURING_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
