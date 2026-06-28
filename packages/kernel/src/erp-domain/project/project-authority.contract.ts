/**
 * PAS-001B B101 — Project domain authority (kernel contracts-only lifecycle).
 */

export const PROJECT_AUTHORITY_PAS = "PAS-001B" as const;

export const PROJECT_REGISTRY_ID = "PKGR01B_PROJECT_VOCABULARY" as const;

export const PROJECT_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/project" as const;

export const PROJECT_AUTHORITY_FINGERPRINT =
  "PROJECT-AUTHORITY-2026-06-28-v1" as const;

export const PROJECT_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type ProjectPackageLifecyclePhase =
  (typeof PROJECT_PACKAGE_LIFECYCLE_PHASES)[number];

export const PROJECT_PACKAGE_LIFECYCLE: ProjectPackageLifecyclePhase =
  "contracts-only";

export function isProjectPackageLifecyclePhase(
  value: string
): value is ProjectPackageLifecyclePhase {
  return (PROJECT_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
