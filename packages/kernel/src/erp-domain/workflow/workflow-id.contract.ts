import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type WorkflowInstanceId = Brand<string, "WorkflowInstanceId">;

export function brandWorkflowInstanceId(
  value: string | WorkflowInstanceId
): WorkflowInstanceId {
  return brandTrimRequired(value, "workflowInstanceId") as WorkflowInstanceId;
}

export function toWorkflowInstanceId(value: WorkflowInstanceId): string {
  return unbrand(value);
}

export type ApprovalTaskId = Brand<string, "ApprovalTaskId">;

export function brandApprovalTaskId(
  value: string | ApprovalTaskId
): ApprovalTaskId {
  return brandTrimRequired(value, "approvalTaskId") as ApprovalTaskId;
}

export function toApprovalTaskId(value: ApprovalTaskId): string {
  return unbrand(value);
}

export type EscalationCaseId = Brand<string, "EscalationCaseId">;

export function brandEscalationCaseId(
  value: string | EscalationCaseId
): EscalationCaseId {
  return brandTrimRequired(value, "escalationCaseId") as EscalationCaseId;
}

export function toEscalationCaseId(value: EscalationCaseId): string {
  return unbrand(value);
}
