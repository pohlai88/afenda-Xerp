export const ACCOUNTING_AUDIT_ACTIONS = [
  "coa.created",
  "coa.updated",
  "coa.deactivated",
  "journal.drafted",
  "journal.approved",
  "journal.posted",
  "journal.reversed",
  "period.opened",
  "period.closed",
  "period.reopened",
  "period.locked",
] as const;

export type AccountingAuditAction = (typeof ACCOUNTING_AUDIT_ACTIONS)[number];

export function isAccountingAuditAction(
  value: string
): value is AccountingAuditAction {
  return (ACCOUNTING_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseAccountingAuditAction(
  value: string
): AccountingAuditAction | null {
  return isAccountingAuditAction(value) ? value : null;
}
