/**
 * PAS-001B B90 — Sales domain authority (kernel contracts-only lifecycle).
 */

export const SALES_AUTHORITY_PAS = "PAS-001B" as const;

export const SALES_REGISTRY_ID = "PKGR01B_SALES_VOCABULARY" as const;

export const SALES_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/sales" as const;

export const SALES_AUTHORITY_FINGERPRINT =
  "SALES-AUTHORITY-2026-06-28-v1" as const;

export const SALES_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type SalesPackageLifecyclePhase =
  (typeof SALES_PACKAGE_LIFECYCLE_PHASES)[number];

export const SALES_PACKAGE_LIFECYCLE: SalesPackageLifecyclePhase =
  "contracts-only";

export function isSalesPackageLifecyclePhase(
  value: string
): value is SalesPackageLifecyclePhase {
  return (SALES_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(value);
}
