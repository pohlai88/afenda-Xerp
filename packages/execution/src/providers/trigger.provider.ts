/**
 * Trigger.dev provider adapter.
 *
 * This is the ONLY module in the monorepo permitted to import `@trigger.dev/sdk`.
 * Business domains must consume `executionService` instead.
 */
import { runs, schedules, task, tasks } from "@trigger.dev/sdk";
import type {
  CancelInput,
  ExecutionHandle,
  ExecutionHealthCheck,
  ExecutionStatusRecord,
  GetStatusInput,
} from "../contracts/execution.contract.js";
import type { ExecutionContext } from "../contracts/execution-context.contract.js";
import type {
  ExecutionProvider,
  ProviderExecuteInput,
  ProviderRetryInput,
  ProviderScheduleInput,
} from "../contracts/execution-provider.contract.js";
import {
  createExecutionFailure,
  createExecutionSuccess,
  type ExecutionResult,
} from "../contracts/execution-result.contract.js";
import {
  computeRetryDelayMs,
  shouldRetry,
} from "../contracts/retry-policy.contract.js";
import type { ScheduleHandle } from "../contracts/workflow.contract.js";
import {
  PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
  PUBLISH_OUTBOX_EVENTS_TRIGGER_TASK_ID,
} from "../jobs/publish-outbox-events.job.js";
import {
  type RunServiceActorS2sPingJobResult,
  SERVICE_ACTOR_S2S_PING_TRIGGER_TASK_ID,
} from "../jobs/service-actor-s2s-ping.job.js";
import { runServiceActorS2sPingProbe } from "../jobs/service-actor-s2s-ping.probe.js";

export interface TriggerExecutionProviderOptions {
  readonly nowIso?: () => string;
  readonly secretKey?: string | null;
}

interface StoredExecution {
  readonly attempt: number;
  readonly context: ExecutionContext;
  readonly executionId: string;
  readonly finishedAt: string | null;
  readonly providerRunId: string | null;
  readonly status: ExecutionStatusRecord["status"];
  readonly triggerTaskId: string;
  readonly workflowId: string;
}

const providerUnavailableMessage =
  "Execution provider is unavailable. Configure TRIGGER_SECRET_KEY to enable Trigger.dev.";

function mapTriggerRunStatus(status: string): ExecutionStatusRecord["status"] {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "FAILED":
    case "CRASHED":
    case "SYSTEM_FAILURE":
      return "failure";
    case "CANCELED":
      return "cancelled";
    case "TIMED_OUT":
      return "timed_out";
    case "EXECUTING":
    case "QUEUED":
    case "DELAYED":
    case "WAITING":
      return "retrying";
    default:
      return "blocked";
  }
}

function readTriggerSecretKey(): string | null {
  return process.env["TRIGGER_SECRET_KEY"] ?? null;
}

type PublishOutboxEventsTaskRun = () => Promise<unknown>;

let publishOutboxEventsTaskRun: PublishOutboxEventsTaskRun | null = null;

/**
 * Injects the ERP-owned publish runner. Called from `@afenda/erp` instrumentation.
 * The Trigger.dev task definition is exported statically as `publishOutboxEventsTriggerTask`.
 */
export function configurePublishOutboxEventsTask(
  run: PublishOutboxEventsTaskRun
): void {
  publishOutboxEventsTaskRun = run;
}

export async function invokeConfiguredPublishOutboxEventsTask(): Promise<unknown> {
  if (publishOutboxEventsTaskRun === null) {
    throw new Error(
      "Publish outbox events task handler is not configured. Call configurePublishOutboxEventsTask from ERP instrumentation."
    );
  }

  return await publishOutboxEventsTaskRun();
}

type ServiceActorS2sPingTaskRun =
  () => Promise<RunServiceActorS2sPingJobResult>;

let serviceActorS2sPingTaskRun: ServiceActorS2sPingTaskRun | null = null;

export function configureServiceActorS2sPingTask(
  run: ServiceActorS2sPingTaskRun
): void {
  serviceActorS2sPingTaskRun = run;
}

export async function invokeConfiguredServiceActorS2sPingTask(): Promise<RunServiceActorS2sPingJobResult> {
  if (serviceActorS2sPingTaskRun !== null) {
    return await serviceActorS2sPingTaskRun();
  }

  // Worker-safe default when ERP instrumentation/bootstrap is not loaded (ADR-0036).
  return await runServiceActorS2sPingProbe();
}

/** Static Trigger.dev task — scanned by `trigger.config.ts` for remote deployment. */
// Task ID must stay aligned with PUBLISH_OUTBOX_EVENTS_* constants in this package's job module.
export const publishOutboxEventsTriggerTask = task({
  id: PUBLISH_OUTBOX_EVENTS_TRIGGER_TASK_ID,
  run: invokeConfiguredPublishOutboxEventsTask,
});

export const serviceActorS2sPingTriggerTask = task({
  id: SERVICE_ACTOR_S2S_PING_TRIGGER_TASK_ID,
  run: invokeConfiguredServiceActorS2sPingTask,
});

export async function probePublishOutboxScheduleRegistered(
  options: TriggerExecutionProviderOptions = {}
): Promise<ExecutionResult<boolean>> {
  const secretKey =
    options.secretKey === undefined
      ? readTriggerSecretKey()
      : options.secretKey;

  if (!secretKey) {
    return createExecutionFailure(
      "provider_unavailable",
      "TRIGGER_SECRET_KEY is not configured."
    );
  }

  try {
    const page = await schedules.list();
    const registered = page.data.some(
      (schedule) =>
        schedule.deduplicationKey === PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID ||
        schedule.task === PUBLISH_OUTBOX_EVENTS_TRIGGER_TASK_ID
    );

    return createExecutionSuccess(registered);
  } catch (error: unknown) {
    return createExecutionFailure(
      "provider_error",
      error instanceof Error
        ? error.message
        : "Trigger.dev schedule probe failed."
    );
  }
}

export function createTriggerExecutionProvider(
  options: TriggerExecutionProviderOptions = {}
): ExecutionProvider {
  const nowIso = options.nowIso ?? (() => new Date().toISOString());
  const secretKey =
    options.secretKey === undefined
      ? readTriggerSecretKey()
      : options.secretKey;
  const localExecutions = new Map<string, StoredExecution>();

  async function executeThroughTrigger(
    input: ProviderExecuteInput
  ): Promise<ExecutionResult<ExecutionHandle>> {
    if (!secretKey) {
      return executeLocally(input);
    }

    try {
      const handle = await tasks.trigger(input.triggerTaskId, {
        ...input.payload,
        executionContext: input.context,
        workflowId: input.workflowId,
      });

      const execution: ExecutionHandle = {
        context: input.context,
        executionId: input.context.executionId,
        kind: input.kind,
        providerRunId: handle.id,
        status: "retrying",
        workflowId: input.workflowId,
      };

      localExecutions.set(execution.executionId, {
        attempt: 1,
        context: input.context,
        executionId: execution.executionId,
        finishedAt: null,
        providerRunId: handle.id,
        status: "retrying",
        triggerTaskId: input.triggerTaskId,
        workflowId: input.workflowId,
      });

      return createExecutionSuccess(execution);
    } catch (error: unknown) {
      return createExecutionFailure(
        "provider_error",
        error instanceof Error ? error.message : "Trigger.dev execution failed."
      );
    }
  }

  function executeLocally(
    input: ProviderExecuteInput
  ): ExecutionResult<ExecutionHandle> {
    const execution: ExecutionHandle = {
      context: input.context,
      executionId: input.context.executionId,
      kind: input.kind,
      providerRunId: `local-${input.context.executionId}`,
      status: "retrying",
      workflowId: input.workflowId,
    };

    localExecutions.set(execution.executionId, {
      attempt: 1,
      context: input.context,
      executionId: execution.executionId,
      finishedAt: null,
      providerRunId: execution.providerRunId,
      status: "retrying",
      triggerTaskId: input.triggerTaskId,
      workflowId: input.workflowId,
    });

    return createExecutionSuccess(execution);
  }

  return {
    providerId: "trigger",

    execute(input: ProviderExecuteInput) {
      return executeThroughTrigger(input);
    },

    async schedule(input: ProviderScheduleInput) {
      const schedule: ScheduleHandle = {
        cron: input.cron,
        scheduleId: input.scheduleId,
        scheduleKind: "cron",
        workflowId: input.workflowId,
      };

      if (!secretKey) {
        return createExecutionSuccess(schedule);
      }

      try {
        await schedules.create({
          cron: input.cron,
          deduplicationKey: input.deduplicationKey,
          externalId: input.context.tenantId ?? undefined,
          task: input.triggerTaskId,
          timezone: input.timezone,
        });

        return createExecutionSuccess(schedule);
      } catch (error: unknown) {
        return createExecutionFailure(
          "provider_error",
          error instanceof Error
            ? error.message
            : "Trigger.dev schedule failed."
        );
      }
    },

    async retry(input: ProviderRetryInput) {
      const existing = localExecutions.get(input.executionId);

      if (!existing) {
        return createExecutionFailure(
          "execution_not_found",
          `Execution "${input.executionId}" was not found.`
        );
      }

      const nextAttempt = existing.attempt + 1;

      if (!shouldRetry(input.retryPolicy, nextAttempt)) {
        return createExecutionFailure(
          "execution_blocked",
          "Retry policy does not allow another attempt."
        );
      }

      const delayMs = computeRetryDelayMs(input.retryPolicy, nextAttempt);
      const retriedContext: ExecutionContext = {
        ...input.context,
        startedAt: nowIso(),
      };

      if (secretKey) {
        try {
          const handle = await tasks.trigger(input.triggerTaskId, {
            delay: `${delayMs}ms`,
            executionContext: retriedContext,
            retryAttempt: nextAttempt,
            workflowId: input.workflowId,
          });

          const execution: ExecutionHandle = {
            context: retriedContext,
            executionId: input.executionId,
            kind: "retry",
            providerRunId: handle.id,
            status: "retrying",
            workflowId: input.workflowId,
          };

          localExecutions.set(input.executionId, {
            ...existing,
            attempt: nextAttempt,
            context: retriedContext,
            providerRunId: handle.id,
            status: "retrying",
          });

          return createExecutionSuccess(execution);
        } catch (error: unknown) {
          return createExecutionFailure(
            "provider_error",
            error instanceof Error ? error.message : "Trigger.dev retry failed."
          );
        }
      }

      const execution: ExecutionHandle = {
        context: retriedContext,
        executionId: input.executionId,
        kind: "retry",
        providerRunId: existing.providerRunId,
        status: "retrying",
        workflowId: input.workflowId,
      };

      localExecutions.set(input.executionId, {
        ...existing,
        attempt: nextAttempt,
        context: retriedContext,
        status: "retrying",
      });

      return createExecutionSuccess(execution);
    },

    async cancel(input: CancelInput) {
      const existing = localExecutions.get(input.executionId);

      if (!existing) {
        return createExecutionFailure(
          "execution_not_found",
          `Execution "${input.executionId}" was not found.`
        );
      }

      if (secretKey && existing.providerRunId) {
        try {
          await runs.cancel(existing.providerRunId);
        } catch (error: unknown) {
          return createExecutionFailure(
            "provider_error",
            error instanceof Error
              ? error.message
              : "Trigger.dev cancel failed."
          );
        }
      }

      localExecutions.set(input.executionId, {
        ...existing,
        finishedAt: nowIso(),
        status: "cancelled",
      });

      return createExecutionSuccess(null);
    },

    async getStatus(input: GetStatusInput) {
      const existing = localExecutions.get(input.executionId);

      if (!existing) {
        return createExecutionFailure(
          "execution_not_found",
          `Execution "${input.executionId}" was not found.`
        );
      }

      if (secretKey && existing.providerRunId) {
        try {
          const run = await runs.retrieve(existing.providerRunId);
          const status = mapTriggerRunStatus(run.status);

          localExecutions.set(input.executionId, {
            ...existing,
            finishedAt:
              status === "success" ||
              status === "failure" ||
              status === "cancelled" ||
              status === "timed_out"
                ? nowIso()
                : existing.finishedAt,
            status,
          });
        } catch {
          return createExecutionFailure(
            "provider_error",
            "Unable to retrieve Trigger.dev run status."
          );
        }
      }

      const current = localExecutions.get(input.executionId);

      if (!current) {
        return createExecutionFailure(
          "execution_not_found",
          `Execution "${input.executionId}" was not found.`
        );
      }

      const record: ExecutionStatusRecord = {
        attempt: current.attempt,
        context: current.context,
        executionId: current.executionId,
        finishedAt: current.finishedAt,
        providerRunId: current.providerRunId,
        status: current.status,
        workflowId: current.workflowId,
      };

      return createExecutionSuccess(record);
    },

    healthCheck(): Promise<ExecutionResult<ExecutionHealthCheck>> {
      const checkedAt = nowIso();

      if (!secretKey) {
        return Promise.resolve(
          createExecutionSuccess({
            checkedAt,
            provider: "trigger",
            status: "degraded",
          })
        );
      }

      return Promise.resolve(
        createExecutionSuccess({
          checkedAt,
          provider: "trigger",
          status: "healthy",
        })
      );
    },
  };
}

export const unavailableTriggerProvider: ExecutionProvider = {
  providerId: "trigger",
  cancel() {
    return Promise.resolve(
      createExecutionFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  execute() {
    return Promise.resolve(
      createExecutionFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  getStatus() {
    return Promise.resolve(
      createExecutionFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  healthCheck() {
    return Promise.resolve(
      createExecutionFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  retry() {
    return Promise.resolve(
      createExecutionFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  schedule() {
    return Promise.resolve(
      createExecutionFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
};
