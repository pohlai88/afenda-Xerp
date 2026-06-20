import type { ExecutionKind } from "./execution.contract.js";
import type { RetryPolicy } from "./retry-policy.contract.js";

export interface JobDefinition {
  readonly description?: string;
  readonly jobId: string;
  readonly kind: Extract<ExecutionKind, "job">;
  readonly retryPolicy: RetryPolicy;
  readonly triggerTaskId: string;
}

export interface RegisterJobInput {
  readonly description?: string;
  readonly jobId: string;
  readonly retryPolicy?: RetryPolicy;
  readonly triggerTaskId: string;
}
