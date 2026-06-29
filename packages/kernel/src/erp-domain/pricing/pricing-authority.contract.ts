/**
 * PAS-001B B92 — Pricing domain authority (kernel contracts-only lifecycle).
 */

export const PRICING_AUTHORITY_PAS = "PAS-001B" as const;

export const PRICING_REGISTRY_ID = "PKGR01B_PRICING_VOCABULARY" as const;

export const PRICING_MODULE_KV_ID = "KV-PRC" as const;

export const PRICING_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/pricing" as const;

export const PRICING_AUTHORITY_FINGERPRINT =
  "PRICING-AUTHORITY-2026-06-28-v1" as const;

export const PRICING_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type PricingPackageLifecyclePhase =
  (typeof PRICING_PACKAGE_LIFECYCLE_PHASES)[number];

export const PRICING_PACKAGE_LIFECYCLE: PricingPackageLifecyclePhase =
  "contracts-only";

export function isPricingPackageLifecyclePhase(
  value: string
): value is PricingPackageLifecyclePhase {
  return (PRICING_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
