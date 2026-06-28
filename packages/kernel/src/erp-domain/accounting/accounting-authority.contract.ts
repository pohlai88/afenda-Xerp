/**
 * PAS-001B B76 · ADR-0020 — Accounting domain authority (contracts-only).
 */

export const ACCOUNTING_AUTHORITY_PAS = "PAS-001B" as const;

export const ACCOUNTING_AUTHORITY_ADR = "ADR-0020" as const;

export const ACCOUNTING_REGISTRY_ID = "PKG-R01" as const;

export const ACCOUNTING_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/accounting" as const;

export const ACCOUNTING_AUTHORITY_FINGERPRINT =
  "ACCOUNTING-AUTHORITY-2026-06-28-v1" as const;

export const ACCOUNTING_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type AccountingPackageLifecyclePhase =
  (typeof ACCOUNTING_PACKAGE_LIFECYCLE_PHASES)[number];

export const ACCOUNTING_PACKAGE_LIFECYCLE: AccountingPackageLifecyclePhase =
  "contracts-only";

export function isAccountingPackageLifecyclePhase(
  value: string
): value is AccountingPackageLifecyclePhase {
  return (ACCOUNTING_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
