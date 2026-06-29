/**
 * PAS-001B B94 — Ecommerce domain authority (kernel contracts-only lifecycle).
 * Serializable surface only; no checkout execution, payment capture, or persistence.
 */

export const ECOMMERCE_AUTHORITY_PAS = "PAS-001B" as const;

export const ECOMMERCE_REGISTRY_ID = "PKGR01B_ECOMMERCE_VOCABULARY" as const;

export const ECOMMERCE_MODULE_KV_ID = "KV-ECOM" as const;

export const ECOMMERCE_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/ecommerce" as const;

export const ECOMMERCE_AUTHORITY_FINGERPRINT =
  "ECOMMERCE-AUTHORITY-2026-06-29-v1" as const;

export const ECOMMERCE_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type EcommercePackageLifecyclePhase =
  (typeof ECOMMERCE_PACKAGE_LIFECYCLE_PHASES)[number];

export const ECOMMERCE_PACKAGE_LIFECYCLE: EcommercePackageLifecyclePhase =
  "contracts-only";

export function isEcommercePackageLifecyclePhase(
  value: string
): value is EcommercePackageLifecyclePhase {
  return (ECOMMERCE_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
