/**
 * ADR-0020 — Accounting domain authority (kernel contracts-only lifecycle).
 * Serializable surface only; no ledger, journal, or posting types.
 */

export const ACCOUNTING_AUTHORITY_ADR = "ADR-0020" as const;

export const ACCOUNTING_REGISTRY_ID = "PKG-R01" as const;

export const ACCOUNTING_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/accounting" as const;

export const ACCOUNTING_AUTHORITY_FINGERPRINT =
  "ACCOUNTING-AUTHORITY-2026-06-27-v1" as const;

export const ACCOUNTING_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type AccountingPackageLifecyclePhase =
  (typeof ACCOUNTING_PACKAGE_LIFECYCLE_PHASES)[number];

/** Current PKG-R01 lifecycle phase — runtime requires separate ADR (TIP-015+). */
export const ACCOUNTING_PACKAGE_LIFECYCLE: AccountingPackageLifecyclePhase =
  "contracts-only";

export function isAccountingPackageLifecyclePhase(
  value: string
): value is AccountingPackageLifecyclePhase {
  return (ACCOUNTING_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
