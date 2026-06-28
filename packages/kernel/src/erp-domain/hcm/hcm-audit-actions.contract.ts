export const HCM_AUDIT_ACTIONS = [
  "requisition.opened",
  "requisition.filled",
  "review.closed",
  "onboarding.completed",
] as const;

export type HcmAuditAction = (typeof HCM_AUDIT_ACTIONS)[number];

export function isHcmAuditAction(value: string): value is HcmAuditAction {
  return (HCM_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseHcmAuditAction(value: string): HcmAuditAction | null {
  return isHcmAuditAction(value) ? value : null;
}
