import type {
  CancelInput,
  ExecutionHandle,
  ExecutionHealthCheck,
  ExecutionKind,
  ExecutionStatusRecord,
  GetStatusInput,
} from "./execution.contract.js";
import type { ExecutionContext } from "./execution-context.contract.js";
import type { ExecutionPayload } from "./execution-metadata.contract.js";
import type { ExecutionResult } from "./execution-result.contract.js";
import type { RetryPolicy } from "./retry-policy.contract.js";
import type { ScheduleHandle } from "./workflow.contract.js";

export type ExecutionProviderId = "trigger";

export interface ProviderExecuteInput {
  readonly context: ExecutionContext;
  readonly kind: ExecutionKind;
  readonly payload: ExecutionPayload;
  readonly retryPolicy: RetryPolicy;
  readonly triggerTaskId: string;
  readonly workflowId: string;
}

export interface ProviderScheduleInput {
  readonly context: ExecutionContext;
  readonly cron: string;
  readonly deduplicationKey: string;
  readonly scheduleId: string;
  readonly timezone?: string;
  readonly triggerTaskId: string;
  readonly workflowId: string;
}

export interface ProviderRetryInput {
  readonly context: ExecutionContext;
  readonly executionId: string;
  readonly retryPolicy: RetryPolicy;
  readonly triggerTaskId: string;
  readonly workflowId: string;
}

export interface ExecutionProvider {
  cancel(input: CancelInput): Promise<ExecutionResult<null>>;
  execute(
    input: ProviderExecuteInput
  ): Promise<ExecutionResult<ExecutionHandle>>;
  getStatus(
    input: GetStatusInput
  ): Promise<ExecutionResult<ExecutionStatusRecord>>;
  healthCheck(): Promise<ExecutionResult<ExecutionHealthCheck>>;
  readonly providerId: ExecutionProviderId;
  retry(input: ProviderRetryInput): Promise<ExecutionResult<ExecutionHandle>>;
  schedule(
    input: ProviderScheduleInput
  ): Promise<ExecutionResult<ScheduleHandle>>;
}
