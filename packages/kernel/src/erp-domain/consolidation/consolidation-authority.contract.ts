/**
 * PAS-001B B84 — Consolidation domain authority (kernel contracts-only lifecycle).
 */

export const CONSOLIDATION_AUTHORITY_PAS = "PAS-001B" as const;

export const CONSOLIDATION_REGISTRY_ID =
  "PKGR01B_CONSOLIDATION_VOCABULARY" as const;

export const CONSOLIDATION_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/consolidation" as const;

export const CONSOLIDATION_AUTHORITY_FINGERPRINT =
  "CONSOLIDATION-AUTHORITY-2026-06-28-v1" as const;

export const CONSOLIDATION_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type ConsolidationPackageLifecyclePhase =
  (typeof CONSOLIDATION_PACKAGE_LIFECYCLE_PHASES)[number];

export const CONSOLIDATION_PACKAGE_LIFECYCLE: ConsolidationPackageLifecyclePhase =
  "contracts-only";

export function isConsolidationPackageLifecyclePhase(
  value: string
): value is ConsolidationPackageLifecyclePhase {
  return (CONSOLIDATION_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
