/**
 * PAS-001B B85 — intercompany domain audit action vocabulary.
 */
export const INTERCOMPANY_AUDIT_ACTIONS = [
  "ic_agreement.created",
  "ic_agreement.updated",
  "ic_agreement.terminated",
  "ic_matching_run.started",
  "ic_matching_run.matched",
  "ic_matching_run.disputed",
  "ic_matching_run.settled",
  "ic_settlement.drafted",
  "ic_settlement.posted",
  "ic_settlement.reversed",
  "ic_billing.issued",
  "ic_billing.received",
] as const;

export type IntercompanyAuditAction =
  (typeof INTERCOMPANY_AUDIT_ACTIONS)[number];

export function isIntercompanyAuditAction(
  value: string
): value is IntercompanyAuditAction {
  return (INTERCOMPANY_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseIntercompanyAuditAction(
  value: string
): IntercompanyAuditAction | null {
  return isIntercompanyAuditAction(value) ? value : null;
}
