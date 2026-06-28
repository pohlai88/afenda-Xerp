export const WORKFLOW_AUDIT_ACTIONS = [
  "workflow.started",
  "workflow.completed",
  "approval.granted",
  "escalation.triggered",
] as const;

export type WorkflowAuditAction = (typeof WORKFLOW_AUDIT_ACTIONS)[number];

export function isWorkflowAuditAction(
  value: string
): value is WorkflowAuditAction {
  return (WORKFLOW_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseWorkflowAuditAction(
  value: string
): WorkflowAuditAction | null {
  return isWorkflowAuditAction(value) ? value : null;
}
