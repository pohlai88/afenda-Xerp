/**
 * PAS-001B B96 — Service domain authority (kernel contracts-only lifecycle).
 */

export const SERVICE_AUTHORITY_PAS = "PAS-001B" as const;

export const SERVICE_REGISTRY_ID = "PKGR01B_SERVICE_VOCABULARY" as const;

export const SERVICE_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/service" as const;

export const SERVICE_AUTHORITY_FINGERPRINT =
  "SERVICE-AUTHORITY-2026-06-28-v1" as const;

export const SERVICE_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type ServicePackageLifecyclePhase =
  (typeof SERVICE_PACKAGE_LIFECYCLE_PHASES)[number];

export const SERVICE_PACKAGE_LIFECYCLE: ServicePackageLifecyclePhase =
  "contracts-only";

export function isServicePackageLifecyclePhase(
  value: string
): value is ServicePackageLifecyclePhase {
  return (SERVICE_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
