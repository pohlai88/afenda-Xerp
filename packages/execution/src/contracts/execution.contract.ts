import type { ExecutionContext } from "@afenda/kernel";
import type { ExecutionPayload } from "./execution-metadata.contract.js";
import type { ScheduleDefinition } from "./schedule.contract.js";

export const EXECUTION_KINDS = [
  "job",
  "workflow",
  "schedule",
  "retry",
  "event_driven",
  "manual",
] as const;

export type ExecutionKind = (typeof EXECUTION_KINDS)[number];

export const EXECUTION_STATUSES = [
  "success",
  "failure",
  "retrying",
  "cancelled",
  "blocked",
  "timed_out",
] as const;

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

export const EXECUTION_AUDIT_ACTIONS = {
  EXECUTION_CANCELLED: "execution.cancelled",
  EXECUTION_COMPLETED: "execution.completed",
  EXECUTION_FAILED: "execution.failed",
  EXECUTION_RETRIED: "execution.retried",
  EXECUTION_STARTED: "execution.started",
  WORKFLOW_COMPLETED: "workflow.completed",
  WORKFLOW_FAILED: "workflow.failed",
  WORKFLOW_STARTED: "workflow.started",
} as const;

export type ExecutionAuditAction =
  (typeof EXECUTION_AUDIT_ACTIONS)[keyof typeof EXECUTION_AUDIT_ACTIONS];

/** Outbox-compatible envelope for future TIP-023 consumers. */
export interface ExecutionOutboxEnvelope {
  readonly correlationId: string;
  readonly eventType: string;
  readonly executionContext: ExecutionContext;
  readonly payload: ExecutionPayload;
}

export interface ExecutionHandle {
  readonly context: ExecutionContext;
  readonly executionId: string;
  readonly kind: ExecutionKind;
  readonly providerRunId: string | null;
  readonly status: ExecutionStatus;
  readonly workflowId: string;
}

export interface ExecutionStatusRecord {
  readonly attempt: number;
  readonly context: ExecutionContext;
  readonly executionId: string;
  readonly finishedAt: string | null;
  readonly providerRunId: string | null;
  readonly status: ExecutionStatus;
  readonly workflowId: string;
}

export interface ExecutionHealthCheck {
  readonly checkedAt: string;
  readonly provider: "trigger";
  readonly status: "healthy" | "degraded" | "unavailable";
}

export interface ExecuteInput {
  readonly context: ExecutionContext;
  readonly kind?: ExecutionKind;
  readonly payload?: ExecutionPayload;
  readonly workflowId: string;
}

export interface ScheduleInput {
  readonly context: ExecutionContext;
  readonly schedule: ScheduleDefinition;
}

export interface RetryInput {
  readonly context: ExecutionContext;
  readonly executionId: string;
  readonly workflowId: string;
}

export interface CancelInput {
  readonly context: ExecutionContext;
  readonly executionId: string;
}

export interface GetStatusInput {
  readonly context: ExecutionContext;
  readonly executionId: string;
}
