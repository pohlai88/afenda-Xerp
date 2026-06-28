/**
 * PAS-001B B90 — sales domain audit action vocabulary.
 */
export const SALES_AUDIT_ACTIONS = [
  "quote.drafted",
  "quote.sent",
  "quote.accepted",
  "quote.rejected",
  "quote.expired",
  "sales_order.drafted",
  "sales_order.confirmed",
  "sales_order.partially_shipped",
  "sales_order.fulfilled",
  "sales_order.cancelled",
  "delivery_schedule.planned",
  "delivery_schedule.updated",
  "delivery_schedule.completed",
] as const;

export type SalesAuditAction = (typeof SALES_AUDIT_ACTIONS)[number];

export function isSalesAuditAction(value: string): value is SalesAuditAction {
  return (SALES_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseSalesAuditAction(value: string): SalesAuditAction | null {
  return isSalesAuditAction(value) ? value : null;
}
