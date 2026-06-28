/**
 * PAS-001B B83 — Tax domain authority (kernel contracts-only lifecycle).
 */

export const TAX_AUTHORITY_PAS = "PAS-001B" as const;

export const TAX_REGISTRY_ID = "PKGR01B_TAX_VOCABULARY" as const;

export const TAX_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/tax" as const;

export const TAX_AUTHORITY_FINGERPRINT = "TAX-AUTHORITY-2026-06-28-v1" as const;

export const TAX_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type TaxPackageLifecyclePhase =
  (typeof TAX_PACKAGE_LIFECYCLE_PHASES)[number];

export const TAX_PACKAGE_LIFECYCLE: TaxPackageLifecyclePhase = "contracts-only";

export function isTaxPackageLifecyclePhase(
  value: string
): value is TaxPackageLifecyclePhase {
  return (TAX_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(value);
}
