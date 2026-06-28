export const WORKFLOW_PERMISSION_DOMAINS = [
  "workflow",
  "approval",
  "escalation",
] as const;

export type WorkflowPermissionDomain =
  (typeof WORKFLOW_PERMISSION_DOMAINS)[number];

export const WORKFLOW_PERMISSION_ACTIONS = {
  workflow: ["read", "create", "cancel"] as const,
  approval: ["read", "approve"] as const,
  escalation: ["read", "manage"] as const,
} as const satisfies Record<WorkflowPermissionDomain, readonly string[]>;

export type WorkflowPermissionAction<
  TDomain extends WorkflowPermissionDomain = WorkflowPermissionDomain,
> = (typeof WORKFLOW_PERMISSION_ACTIONS)[TDomain][number];

export function toWorkflowPermissionKey(
  domain: WorkflowPermissionDomain,
  action: WorkflowPermissionAction
): string {
  return `workflow.${domain}_${action}`;
}

export const WORKFLOW_PERMISSION_KEY_VOCABULARY = [
  toWorkflowPermissionKey("workflow", "read"),
  toWorkflowPermissionKey("workflow", "create"),
  toWorkflowPermissionKey("workflow", "cancel"),
  toWorkflowPermissionKey("approval", "read"),
  toWorkflowPermissionKey("approval", "approve"),
  toWorkflowPermissionKey("escalation", "read"),
  toWorkflowPermissionKey("escalation", "manage"),
] as const;

export type WorkflowPermissionKey =
  (typeof WORKFLOW_PERMISSION_KEY_VOCABULARY)[number];
