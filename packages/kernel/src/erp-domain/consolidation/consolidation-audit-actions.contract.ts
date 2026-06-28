export const CONSOLIDATION_AUDIT_ACTIONS = [
  "run.started",
  "run.posted",
  "elimination.recorded",
  "run.locked",
] as const;

export type ConsolidationAuditAction =
  (typeof CONSOLIDATION_AUDIT_ACTIONS)[number];

export function isConsolidationAuditAction(
  value: string
): value is ConsolidationAuditAction {
  return (CONSOLIDATION_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseConsolidationAuditAction(
  value: string
): ConsolidationAuditAction | null {
  return isConsolidationAuditAction(value) ? value : null;
}
