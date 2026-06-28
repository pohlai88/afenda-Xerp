/**
 * PAS-001B B85 — Intercompany domain authority (kernel contracts-only lifecycle).
 */

export const INTERCOMPANY_AUTHORITY_PAS = "PAS-001B" as const;

export const INTERCOMPANY_REGISTRY_ID =
  "PKGR01B_INTERCOMPANY_VOCABULARY" as const;

export const INTERCOMPANY_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/intercompany" as const;

export const INTERCOMPANY_AUTHORITY_FINGERPRINT =
  "INTERCOMPANY-AUTHORITY-2026-06-28-v1" as const;

export const INTERCOMPANY_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type IntercompanyPackageLifecyclePhase =
  (typeof INTERCOMPANY_PACKAGE_LIFECYCLE_PHASES)[number];

export const INTERCOMPANY_PACKAGE_LIFECYCLE: IntercompanyPackageLifecyclePhase =
  "contracts-only";

export function isIntercompanyPackageLifecyclePhase(
  value: string
): value is IntercompanyPackageLifecyclePhase {
  return (INTERCOMPANY_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
