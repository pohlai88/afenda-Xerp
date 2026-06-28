export const TREASURY_AUDIT_ACTIONS = [
  "payment.scheduled",
  "payment.sent",
  "cash.position_updated",
  "statement.imported",
] as const;

export type TreasuryAuditAction = (typeof TREASURY_AUDIT_ACTIONS)[number];

export function isTreasuryAuditAction(
  value: string
): value is TreasuryAuditAction {
  return (TREASURY_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseTreasuryAuditAction(
  value: string
): TreasuryAuditAction | null {
  return isTreasuryAuditAction(value) ? value : null;
}
