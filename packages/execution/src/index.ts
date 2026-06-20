// biome-ignore-all lint/performance/noBarrelFile: package root is the curated public API surface.

export const PACKAGE_NAME = "@afenda/execution" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  type CancelInput,
  EXECUTION_AUDIT_ACTIONS,
  EXECUTION_KINDS,
  EXECUTION_STATUSES,
  type ExecuteInput,
  type ExecutionAuditAction,
  type ExecutionHandle,
  type ExecutionHealthCheck,
  type ExecutionKind,
  type ExecutionOutboxEnvelope,
  type ExecutionStatus,
  type ExecutionStatusRecord,
  type GetStatusInput,
  type RetryInput,
  type ScheduleInput,
} from "./contracts/execution.contract.js";
export {
  assertExecutionContext,
  createExecutionContext,
  createExecutionId,
  EXECUTION_CONTEXT_SOURCES,
  type ExecutionContext,
  type ExecutionContextInput,
  type ExecutionContextSource,
} from "./contracts/execution-context.contract.js";
export {
  EXECUTION_ERROR_CODES,
  type ExecutionError,
  type ExecutionErrorCode,
} from "./contracts/execution-error.contract.js";
export {
  type ExecutionJsonObject,
  type ExecutionJsonPrimitive,
  type ExecutionJsonValue,
  type ExecutionPayload,
  isExecutionJsonValue,
  isExecutionPayload,
} from "./contracts/execution-metadata.contract.js";
export type {
  ExecutionProvider,
  ExecutionProviderId,
  ProviderExecuteInput,
  ProviderRetryInput,
  ProviderScheduleInput,
} from "./contracts/execution-provider.contract.js";
export {
  createExecutionFailure,
  createExecutionSuccess,
  type ExecutionFailureResult,
  type ExecutionResult,
  type ExecutionSuccessResult,
  isExecutionSuccess,
} from "./contracts/execution-result.contract.js";
export type {
  JobDefinition,
  RegisterJobInput,
} from "./contracts/job.contract.js";
export {
  computeRetryDelayMs,
  DEFAULT_RETRY_POLICY,
  type RetryPolicy,
  shouldRetry,
  validateRetryPolicy,
} from "./contracts/retry-policy.contract.js";
export {
  resolveScheduleCron,
  SCHEDULE_CRON_PRESETS,
  SCHEDULE_KINDS,
  type ScheduleDefinition,
  type ScheduleKind,
  validateScheduleDefinition,
} from "./contracts/schedule.contract.js";
export type {
  RegisterWorkflowInput,
  ScheduleHandle,
  WorkflowDefinition,
} from "./contracts/workflow.contract.js";
export { createTriggerExecutionProvider } from "./providers/trigger.provider.js";
export {
  createExecutionRegistry,
  type ExecutionRegistry,
  executionRegistry,
} from "./registry/execution-registry.js";
export {
  createExecutionService,
  type ExecutionService,
  type ExecutionServiceDependencies,
  executionService,
} from "./services/execution.service.js";
