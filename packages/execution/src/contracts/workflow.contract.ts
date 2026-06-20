import type { ExecutionKind } from "./execution.contract.js";
import type { RetryPolicy } from "./retry-policy.contract.js";
import type { ScheduleKind } from "./schedule.contract.js";

export interface WorkflowDefinition {
  readonly description?: string;
  readonly kind: ExecutionKind;
  readonly retryPolicy: RetryPolicy;
  readonly triggerTaskId: string;
  readonly workflowId: string;
}

export interface RegisterWorkflowInput {
  readonly description?: string;
  readonly kind?: ExecutionKind;
  readonly retryPolicy?: RetryPolicy;
  readonly triggerTaskId: string;
  readonly workflowId: string;
}

export interface ScheduleHandle {
  readonly cron: string | null;
  readonly scheduleId: string;
  readonly scheduleKind: ScheduleKind;
  readonly workflowId: string;
}
