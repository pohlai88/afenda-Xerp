export const PAYROLL_AUDIT_ACTIONS = [
  "run.calculated",
  "run.approved",
  "run.paid",
  "adjustment.applied",
] as const;

export type PayrollAuditAction = (typeof PAYROLL_AUDIT_ACTIONS)[number];

export function isPayrollAuditAction(
  value: string
): value is PayrollAuditAction {
  return (PAYROLL_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parsePayrollAuditAction(
  value: string
): PayrollAuditAction | null {
  return isPayrollAuditAction(value) ? value : null;
}
