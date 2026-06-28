export const PAYROLL_RUN_STATUSES = [
  "draft",
  "calculated",
  "approved",
  "paid",
  "reversed",
] as const;

export type PayrollRunStatus = (typeof PAYROLL_RUN_STATUSES)[number];

export function isPayrollRunStatus(value: string): value is PayrollRunStatus {
  return (PAYROLL_RUN_STATUSES as readonly string[]).includes(value);
}
