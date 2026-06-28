export const PRICING_AUDIT_ACTIONS = [
  "price_list.activated",
  "discount.approved",
  "rule.updated",
  "approval.rejected",
] as const;

export type PricingAuditAction = (typeof PRICING_AUDIT_ACTIONS)[number];

export function isPricingAuditAction(
  value: string
): value is PricingAuditAction {
  return (PRICING_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parsePricingAuditAction(
  value: string
): PricingAuditAction | null {
  return isPricingAuditAction(value) ? value : null;
}
