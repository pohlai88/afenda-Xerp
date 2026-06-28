/**
 * PAS-001B B82 — Treasury domain authority (kernel contracts-only lifecycle).
 */

export const TREASURY_AUTHORITY_PAS = "PAS-001B" as const;

export const TREASURY_REGISTRY_ID = "PKGR01B_TREASURY_VOCABULARY" as const;

export const TREASURY_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/treasury" as const;

export const TREASURY_AUTHORITY_FINGERPRINT =
  "TREASURY-AUTHORITY-2026-06-28-v1" as const;

export const TREASURY_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type TreasuryPackageLifecyclePhase =
  (typeof TREASURY_PACKAGE_LIFECYCLE_PHASES)[number];

export const TREASURY_PACKAGE_LIFECYCLE: TreasuryPackageLifecyclePhase =
  "contracts-only";

export function isTreasuryPackageLifecyclePhase(
  value: string
): value is TreasuryPackageLifecyclePhase {
  return (TREASURY_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
