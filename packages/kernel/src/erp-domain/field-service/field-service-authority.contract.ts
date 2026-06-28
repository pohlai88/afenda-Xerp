/**
 * PAS-001B B97 — FieldService domain authority (kernel contracts-only lifecycle).
 */

export const FIELD_SERVICE_AUTHORITY_PAS = "PAS-001B" as const;

export const FIELD_SERVICE_REGISTRY_ID =
  "PKGR01B_FIELD_SERVICE_VOCABULARY" as const;

export const FIELD_SERVICE_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/field-service" as const;

export const FIELD_SERVICE_AUTHORITY_FINGERPRINT =
  "FIELD_SERVICE-AUTHORITY-2026-06-28-v1" as const;

export const FIELD_SERVICE_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type FieldServicePackageLifecyclePhase =
  (typeof FIELD_SERVICE_PACKAGE_LIFECYCLE_PHASES)[number];

export const FIELD_SERVICE_PACKAGE_LIFECYCLE: FieldServicePackageLifecyclePhase =
  "contracts-only";

export function isFieldServicePackageLifecyclePhase(
  value: string
): value is FieldServicePackageLifecyclePhase {
  return (FIELD_SERVICE_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
