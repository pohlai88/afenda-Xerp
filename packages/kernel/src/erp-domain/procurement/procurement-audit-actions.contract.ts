/**
 * PAS-001B B80 — procurement domain audit action vocabulary.
 */
export const PROCUREMENT_AUDIT_ACTIONS = [
  "requisition.drafted",
  "requisition.submitted",
  "requisition.approved",
  "requisition.rejected",
  "requisition.cancelled",
  "rfq.published",
  "rfq.closed",
  "purchase_order.drafted",
  "purchase_order.sent",
  "purchase_order.acknowledged",
  "purchase_order.received",
  "purchase_order.closed",
  "purchase_order.cancelled",
] as const;

export type ProcurementAuditAction = (typeof PROCUREMENT_AUDIT_ACTIONS)[number];

export function isProcurementAuditAction(
  value: string
): value is ProcurementAuditAction {
  return (PROCUREMENT_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseProcurementAuditAction(
  value: string
): ProcurementAuditAction | null {
  return isProcurementAuditAction(value) ? value : null;
}
