export const CRM_AUDIT_ACTIONS = [
  "lead.converted",
  "opportunity.won",
  "opportunity.lost",
  "activity.logged",
] as const;

export type CrmAuditAction = (typeof CRM_AUDIT_ACTIONS)[number];

export function isCrmAuditAction(value: string): value is CrmAuditAction {
  return (CRM_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseCrmAuditAction(value: string): CrmAuditAction | null {
  return isCrmAuditAction(value) ? value : null;
}
