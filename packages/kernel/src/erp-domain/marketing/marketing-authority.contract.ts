/**
 * PAS-001B B98 — Marketing domain authority (kernel contracts-only lifecycle).
 */

export const MARKETING_AUTHORITY_PAS = "PAS-001B" as const;

export const MARKETING_REGISTRY_ID = "PKGR01B_MARKETING_VOCABULARY" as const;

export const MARKETING_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/marketing" as const;

export const MARKETING_AUTHORITY_FINGERPRINT =
  "MARKETING-AUTHORITY-2026-06-28-v1" as const;

export const MARKETING_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type MarketingPackageLifecyclePhase =
  (typeof MARKETING_PACKAGE_LIFECYCLE_PHASES)[number];

export const MARKETING_PACKAGE_LIFECYCLE: MarketingPackageLifecyclePhase =
  "contracts-only";

export function isMarketingPackageLifecyclePhase(
  value: string
): value is MarketingPackageLifecyclePhase {
  return (MARKETING_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
