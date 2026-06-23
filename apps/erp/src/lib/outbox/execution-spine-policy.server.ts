import { parseEnvBoolean } from "@afenda/execution";

export interface ExecutionSpinePolicy {
  readonly allowDegradedExecution: boolean;
  readonly schedulerRequired: boolean;
}

export type TriggerProviderState = "active" | "degraded" | "unavailable";

export class ExecutionSpinePolicyViolationError extends Error {
  readonly code = "execution_spine_policy_violation" as const;

  constructor(message: string) {
    super(message);
    this.name = "ExecutionSpinePolicyViolationError";
  }
}

export function readExecutionSpinePolicy(
  env: NodeJS.ProcessEnv = process.env
): ExecutionSpinePolicy {
  return {
    allowDegradedExecution: parseEnvBoolean(
      env["ALLOW_DEGRADED_EXECUTION"],
      false
    ),
    schedulerRequired: parseEnvBoolean(env["OUTBOX_SCHEDULER_REQUIRED"], false),
  };
}

export function readTriggerSecretKeyConfigured(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return Boolean(env["TRIGGER_SECRET_KEY"]?.trim());
}

export function resolveTriggerProviderState(
  env: NodeJS.ProcessEnv = process.env
): TriggerProviderState {
  return readTriggerSecretKeyConfigured(env) ? "active" : "degraded";
}

export function assertSchedulerStartupPolicy(input: {
  readonly policy: ExecutionSpinePolicy;
  readonly scheduleErrorMessage: string | null;
  readonly scheduleRegistered: boolean;
  readonly triggerSecretKeyConfigured: boolean;
}): void {
  if (!input.policy.schedulerRequired) {
    return;
  }

  if (!input.triggerSecretKeyConfigured) {
    if (input.policy.allowDegradedExecution) {
      return;
    }

    throw new ExecutionSpinePolicyViolationError(
      "OUTBOX_SCHEDULER_REQUIRED is true but TRIGGER_SECRET_KEY is not configured. Set TRIGGER_SECRET_KEY or ALLOW_DEGRADED_EXECUTION=true only during incident response."
    );
  }

  if (!input.scheduleRegistered) {
    if (input.policy.allowDegradedExecution) {
      return;
    }

    throw new ExecutionSpinePolicyViolationError(
      `Outbox schedule registration failed while OUTBOX_SCHEDULER_REQUIRED is true: ${input.scheduleErrorMessage ?? "unknown error"}`
    );
  }
}

export function assertWorkerReleaseStartupPolicy(input: {
  readonly alignmentErrorMessage: string | null;
  readonly policy: ExecutionSpinePolicy;
  readonly workerReleaseAligned: boolean;
  readonly workerReleaseCheckRequired: boolean;
}): void {
  if (!input.workerReleaseCheckRequired) {
    return;
  }

  if (input.workerReleaseAligned) {
    return;
  }

  if (input.policy.allowDegradedExecution) {
    return;
  }

  throw new ExecutionSpinePolicyViolationError(
    `Trigger worker release alignment failed while WORKER_RELEASE_CHECK_REQUIRED is true: ${input.alignmentErrorMessage ?? "unknown error"}`
  );
}
