/**
 * PAS-001B B81 — Controlling domain authority (kernel contracts-only lifecycle).
 */

export const CONTROLLING_AUTHORITY_PAS = "PAS-001B" as const;

export const CONTROLLING_REGISTRY_ID =
  "PKGR01B_CONTROLLING_VOCABULARY" as const;

export const CONTROLLING_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/controlling" as const;

export const CONTROLLING_AUTHORITY_FINGERPRINT =
  "CONTROLLING-AUTHORITY-2026-06-28-v1" as const;

export const CONTROLLING_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type ControllingPackageLifecyclePhase =
  (typeof CONTROLLING_PACKAGE_LIFECYCLE_PHASES)[number];

export const CONTROLLING_PACKAGE_LIFECYCLE: ControllingPackageLifecyclePhase =
  "contracts-only";

export function isControllingPackageLifecyclePhase(
  value: string
): value is ControllingPackageLifecyclePhase {
  return (CONTROLLING_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
