/**
 * PAS-001B B91 — Crm domain authority (kernel contracts-only lifecycle).
 */

export const CRM_AUTHORITY_PAS = "PAS-001B" as const;

export const CRM_REGISTRY_ID = "PKGR01B_CRM_VOCABULARY" as const;

export const CRM_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/crm" as const;

export const CRM_AUTHORITY_FINGERPRINT = "CRM-AUTHORITY-2026-06-28-v1" as const;

export const CRM_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type CrmPackageLifecyclePhase =
  (typeof CRM_PACKAGE_LIFECYCLE_PHASES)[number];

export const CRM_PACKAGE_LIFECYCLE: CrmPackageLifecyclePhase = "contracts-only";

export function isCrmPackageLifecyclePhase(
  value: string
): value is CrmPackageLifecyclePhase {
  return (CRM_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(value);
}
