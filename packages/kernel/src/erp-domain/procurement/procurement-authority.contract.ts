/**
 * PAS-001B B80 — Procurement domain authority (kernel contracts-only lifecycle).
 * Serializable surface only; no PO posting, GR/IR matching, or persistence.
 */

export const PROCUREMENT_AUTHORITY_PAS = "PAS-001B" as const;

export const PROCUREMENT_REGISTRY_ID =
  "PKGR01B_PROCUREMENT_VOCABULARY" as const;

export const PROCUREMENT_MODULE_KV_ID = "KV-PROC" as const;

export const PROCUREMENT_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/procurement" as const;

export const PROCUREMENT_AUTHORITY_FINGERPRINT =
  "PROCUREMENT-AUTHORITY-2026-06-28-v1" as const;

export const PROCUREMENT_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type ProcurementPackageLifecyclePhase =
  (typeof PROCUREMENT_PACKAGE_LIFECYCLE_PHASES)[number];

export const PROCUREMENT_PACKAGE_LIFECYCLE: ProcurementPackageLifecyclePhase =
  "contracts-only";

export function isProcurementPackageLifecyclePhase(
  value: string
): value is ProcurementPackageLifecyclePhase {
  return (PROCUREMENT_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
