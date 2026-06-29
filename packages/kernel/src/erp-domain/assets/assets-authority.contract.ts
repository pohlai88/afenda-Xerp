/**
 * PAS-001B B102 — Assets domain authority (kernel contracts-only lifecycle).
 */

export const ASSETS_AUTHORITY_PAS = "PAS-001B" as const;

export const ASSETS_REGISTRY_ID = "PKGR01B_ASSETS_VOCABULARY" as const;

export const ASSETS_MODULE_KV_ID = "KV-AA" as const;

export const ASSETS_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/assets" as const;

export const ASSETS_AUTHORITY_FINGERPRINT =
  "ASSETS-AUTHORITY-2026-06-28-v1" as const;

export const ASSETS_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type AssetsPackageLifecyclePhase =
  (typeof ASSETS_PACKAGE_LIFECYCLE_PHASES)[number];

export const ASSETS_PACKAGE_LIFECYCLE: AssetsPackageLifecyclePhase =
  "contracts-only";

export function isAssetsPackageLifecyclePhase(
  value: string
): value is AssetsPackageLifecyclePhase {
  return (ASSETS_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(value);
}
