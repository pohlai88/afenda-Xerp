export const PAYROLL_PERMISSION_DOMAINS = [
  "payrollRun",
  "payslip",
  "adjustment",
] as const;

export type PayrollPermissionDomain =
  (typeof PAYROLL_PERMISSION_DOMAINS)[number];

export const PAYROLL_PERMISSION_ACTIONS = {
  payrollRun: ["read", "create", "approve", "cancel"] as const,
  payslip: ["read", "manage"] as const,
  adjustment: ["read", "manage"] as const,
} as const satisfies Record<PayrollPermissionDomain, readonly string[]>;

export type PayrollPermissionAction<
  TDomain extends PayrollPermissionDomain = PayrollPermissionDomain,
> = (typeof PAYROLL_PERMISSION_ACTIONS)[TDomain][number];

export function toPayrollPermissionKey(
  domain: PayrollPermissionDomain,
  action: PayrollPermissionAction
): string {
  return `payroll.${domain}_${action}`;
}

export const PAYROLL_PERMISSION_KEY_VOCABULARY = [
  toPayrollPermissionKey("payrollRun", "read"),
  toPayrollPermissionKey("payrollRun", "create"),
  toPayrollPermissionKey("payrollRun", "approve"),
  toPayrollPermissionKey("payrollRun", "cancel"),
  toPayrollPermissionKey("payslip", "read"),
  toPayrollPermissionKey("payslip", "manage"),
  toPayrollPermissionKey("adjustment", "read"),
  toPayrollPermissionKey("adjustment", "manage"),
] as const;

export type PayrollPermissionKey =
  (typeof PAYROLL_PERMISSION_KEY_VOCABULARY)[number];
