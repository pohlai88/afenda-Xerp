export const MARKETING_AUDIT_ACTIONS = [
  "campaign.launched",
  "campaign.paused",
  "segment.updated",
  "variant.published",
] as const;

export type MarketingAuditAction = (typeof MARKETING_AUDIT_ACTIONS)[number];

export function isMarketingAuditAction(
  value: string
): value is MarketingAuditAction {
  return (MARKETING_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseMarketingAuditAction(
  value: string
): MarketingAuditAction | null {
  return isMarketingAuditAction(value) ? value : null;
}
