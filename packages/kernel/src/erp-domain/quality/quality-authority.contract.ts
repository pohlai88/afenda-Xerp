/**
 * PAS-001B B87 — Quality domain authority (kernel contracts-only lifecycle).
 */

export const QUALITY_AUTHORITY_PAS = "PAS-001B" as const;

export const QUALITY_REGISTRY_ID = "PKGR01B_QUALITY_VOCABULARY" as const;

export const QUALITY_MODULE_KV_ID = "KV-QM" as const;

export const QUALITY_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/quality" as const;

export const QUALITY_AUTHORITY_FINGERPRINT =
  "QUALITY-AUTHORITY-2026-06-28-v1" as const;

export const QUALITY_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type QualityPackageLifecyclePhase =
  (typeof QUALITY_PACKAGE_LIFECYCLE_PHASES)[number];

export const QUALITY_PACKAGE_LIFECYCLE: QualityPackageLifecyclePhase =
  "contracts-only";

export function isQualityPackageLifecyclePhase(
  value: string
): value is QualityPackageLifecyclePhase {
  return (QUALITY_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
