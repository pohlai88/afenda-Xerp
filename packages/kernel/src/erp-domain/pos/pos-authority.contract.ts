/**
 * PAS-001B B95 — Pos domain authority (kernel contracts-only lifecycle).
 */

export const POS_AUTHORITY_PAS = "PAS-001B" as const;

export const POS_REGISTRY_ID = "PKGR01B_POS_VOCABULARY" as const;

export const POS_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/pos" as const;

export const POS_AUTHORITY_FINGERPRINT = "POS-AUTHORITY-2026-06-28-v1" as const;

export const POS_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type PosPackageLifecyclePhase =
  (typeof POS_PACKAGE_LIFECYCLE_PHASES)[number];

export const POS_PACKAGE_LIFECYCLE: PosPackageLifecyclePhase = "contracts-only";

export function isPosPackageLifecyclePhase(
  value: string
): value is PosPackageLifecyclePhase {
  return (POS_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(value);
}
