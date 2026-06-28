/**
 * PAS-001B B94 — ecommerce domain audit action vocabulary.
 */
export const ECOMMERCE_AUDIT_ACTIONS = [
  "web_cart.created",
  "web_cart.updated",
  "web_cart.abandoned",
  "web_cart.converted",
  "web_cart.merged",
  "checkout_session.started",
  "checkout_session.step_completed",
  "checkout_session.completed",
  "web_order.placed",
  "web_order.paid",
  "web_order.fulfilled",
  "web_order.refunded",
] as const;

export type EcommerceAuditAction = (typeof ECOMMERCE_AUDIT_ACTIONS)[number];

export function isEcommerceAuditAction(
  value: string
): value is EcommerceAuditAction {
  return (ECOMMERCE_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseEcommerceAuditAction(
  value: string
): EcommerceAuditAction | null {
  return isEcommerceAuditAction(value) ? value : null;
}
