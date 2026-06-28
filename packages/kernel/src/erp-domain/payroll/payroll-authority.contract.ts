/**
 * PAS-001B B100 — Payroll domain authority (kernel contracts-only lifecycle).
 */

export const PAYROLL_AUTHORITY_PAS = "PAS-001B" as const;

export const PAYROLL_REGISTRY_ID = "PKGR01B_PAYROLL_VOCABULARY" as const;

export const PAYROLL_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/payroll" as const;

export const PAYROLL_AUTHORITY_FINGERPRINT =
  "PAYROLL-AUTHORITY-2026-06-28-v1" as const;

export const PAYROLL_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type PayrollPackageLifecyclePhase =
  (typeof PAYROLL_PACKAGE_LIFECYCLE_PHASES)[number];

export const PAYROLL_PACKAGE_LIFECYCLE: PayrollPackageLifecyclePhase =
  "contracts-only";

export function isPayrollPackageLifecyclePhase(
  value: string
): value is PayrollPackageLifecyclePhase {
  return (PAYROLL_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
