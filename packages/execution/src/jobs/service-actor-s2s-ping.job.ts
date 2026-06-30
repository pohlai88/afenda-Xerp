import type { ExecutionResult } from "../contracts/execution-result.contract.js";
import {
  createExecutionFailure,
  createExecutionSuccess,
} from "../contracts/execution-result.contract.js";
import { DEFAULT_RETRY_POLICY } from "../contracts/retry-policy.contract.js";
import type { ExecutionRegistry } from "../registry/execution-registry.js";

export const SERVICE_ACTOR_S2S_PING_WORKFLOW_ID =
  "foundation.service-actor-s2s-ping" as const;

export const SERVICE_ACTOR_S2S_PING_TRIGGER_TASK_ID =
  "foundation.service-actor-s2s-ping" as const;

export function registerServiceActorS2sPingWorkflow(
  registry: ExecutionRegistry
) {
  return registry.registerWorkflow({
    description:
      "Probe ERP internal v1 service-actor S2S ping with verified bearer (ADR-0036).",
    kind: "job",
    retryPolicy: DEFAULT_RETRY_POLICY,
    triggerTaskId: SERVICE_ACTOR_S2S_PING_TRIGGER_TASK_ID,
    workflowId: SERVICE_ACTOR_S2S_PING_WORKFLOW_ID,
  });
}

export type RunServiceActorS2sPingJobResult = {
  readonly correlationId: string;
  readonly status: "ok";
};

export async function runServiceActorS2sPingJob(
  probe: () => Promise<RunServiceActorS2sPingJobResult>
): Promise<ExecutionResult<RunServiceActorS2sPingJobResult>> {
  try {
    const result = await probe();
    return createExecutionSuccess(result);
  } catch (error: unknown) {
    return createExecutionFailure(
      "provider_error",
      error instanceof Error
        ? error.message
        : "Service-actor S2S ping probe failed."
    );
  }
}
