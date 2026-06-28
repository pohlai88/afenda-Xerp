export const POS_AUDIT_ACTIONS = [
  "session.opened",
  "session.closed",
  "transaction.voided",
  "shift.reconciled",
] as const;

export type PosAuditAction = (typeof POS_AUDIT_ACTIONS)[number];

export function isPosAuditAction(value: string): value is PosAuditAction {
  return (POS_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parsePosAuditAction(value: string): PosAuditAction | null {
  return isPosAuditAction(value) ? value : null;
}
