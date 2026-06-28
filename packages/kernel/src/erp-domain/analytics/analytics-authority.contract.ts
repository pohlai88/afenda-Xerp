/**
 * PAS-001B B105 — Analytics domain authority (kernel contracts-only lifecycle).
 */

export const ANALYTICS_AUTHORITY_PAS = "PAS-001B" as const;

export const ANALYTICS_REGISTRY_ID = "PKGR01B_ANALYTICS_VOCABULARY" as const;

export const ANALYTICS_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/analytics" as const;

export const ANALYTICS_AUTHORITY_FINGERPRINT =
  "ANALYTICS-AUTHORITY-2026-06-28-v1" as const;

export const ANALYTICS_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type AnalyticsPackageLifecyclePhase =
  (typeof ANALYTICS_PACKAGE_LIFECYCLE_PHASES)[number];

export const ANALYTICS_PACKAGE_LIFECYCLE: AnalyticsPackageLifecyclePhase =
  "contracts-only";

export function isAnalyticsPackageLifecyclePhase(
  value: string
): value is AnalyticsPackageLifecyclePhase {
  return (ANALYTICS_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
