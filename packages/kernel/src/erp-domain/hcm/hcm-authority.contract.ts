/**
 * PAS-001B B99 — Hcm domain authority (kernel contracts-only lifecycle).
 */

export const HCM_AUTHORITY_PAS = "PAS-001B" as const;

export const HCM_REGISTRY_ID = "PKGR01B_HCM_VOCABULARY" as const;

export const HCM_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/hcm" as const;

export const HCM_AUTHORITY_FINGERPRINT = "HCM-AUTHORITY-2026-06-28-v1" as const;

export const HCM_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type HcmPackageLifecyclePhase =
  (typeof HCM_PACKAGE_LIFECYCLE_PHASES)[number];

export const HCM_PACKAGE_LIFECYCLE: HcmPackageLifecyclePhase = "contracts-only";

export function isHcmPackageLifecyclePhase(
  value: string
): value is HcmPackageLifecyclePhase {
  return (HCM_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(value);
}
