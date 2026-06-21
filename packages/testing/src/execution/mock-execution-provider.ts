import {
  type CancelInput,
  createExecutionContext,
  createExecutionFailure,
  createExecutionSuccess,
  type ExecutionContextInput,
  type ExecutionHandle,
  type ExecutionHealthCheck,
  type ExecutionProvider,
  type ExecutionResult,
  type ExecutionStatusRecord,
  type GetStatusInput,
  type ProviderExecuteInput,
  type ProviderRetryInput,
  type ProviderScheduleInput,
  type ScheduleHandle,
  shouldRetry,
} from "@afenda/execution";

export interface MockExecutionProviderOptions {
  readonly failExecution?: boolean;
  readonly failRetryAfterAttempt?: number;
  readonly nowIso?: string;
}

const defaultNowIso = "2026-06-20T00:00:00.000Z";

export interface MockExecutionProvider extends ExecutionProvider {
  markSuccess(executionId: string): void;
}

export function createMockExecutionProvider(
  options: MockExecutionProviderOptions = {}
): MockExecutionProvider {
  const nowIso = options.nowIso ?? defaultNowIso;
  const executions = new Map<string, ExecutionStatusRecord>();
  const schedules = new Map<string, ScheduleHandle>();

  return {
    providerId: "trigger",

    execute(input: ProviderExecuteInput) {
      if (options.failExecution) {
        return Promise.resolve(
          createExecutionFailure("provider_error", "Mock execution failure.")
        );
      }

      const handle: ExecutionHandle = {
        context: input.context,
        executionId: input.context.executionId,
        kind: input.kind,
        providerRunId: `mock-${input.context.executionId}`,
        status: "retrying",
        workflowId: input.workflowId,
      };

      executions.set(handle.executionId, {
        attempt: 1,
        context: input.context,
        executionId: handle.executionId,
        finishedAt: null,
        providerRunId: handle.providerRunId,
        status: "retrying",
        workflowId: input.workflowId,
      });

      return Promise.resolve(createExecutionSuccess(handle));
    },

    schedule(input: ProviderScheduleInput) {
      const schedule: ScheduleHandle = {
        cron: input.cron,
        scheduleId: input.scheduleId,
        scheduleKind: "cron",
        workflowId: input.workflowId,
      };

      schedules.set(input.deduplicationKey, schedule);

      return Promise.resolve(createExecutionSuccess(schedule));
    },

    retry(input: ProviderRetryInput) {
      const existing = executions.get(input.executionId);

      if (!existing) {
        return Promise.resolve(
          createExecutionFailure(
            "execution_not_found",
            `Execution "${input.executionId}" was not found.`
          )
        );
      }

      const nextAttempt = existing.attempt + 1;

      if (!shouldRetry(input.retryPolicy, nextAttempt)) {
        return Promise.resolve(
          createExecutionFailure(
            "execution_blocked",
            "Retry policy does not allow another attempt."
          )
        );
      }

      if (
        options.failRetryAfterAttempt !== undefined &&
        nextAttempt >= options.failRetryAfterAttempt
      ) {
        return Promise.resolve(
          createExecutionFailure("provider_error", "Mock retry failure.")
        );
      }

      const handle: ExecutionHandle = {
        context: input.context,
        executionId: input.executionId,
        kind: "retry",
        providerRunId: existing.providerRunId,
        status: "retrying",
        workflowId: input.workflowId,
      };

      executions.set(input.executionId, {
        ...existing,
        attempt: nextAttempt,
        status: "retrying",
      });

      return Promise.resolve(createExecutionSuccess(handle));
    },

    cancel(input: CancelInput) {
      const existing = executions.get(input.executionId);

      if (!existing) {
        return Promise.resolve(
          createExecutionFailure(
            "execution_not_found",
            `Execution "${input.executionId}" was not found.`
          )
        );
      }

      executions.set(input.executionId, {
        ...existing,
        finishedAt: nowIso,
        status: "cancelled",
      });

      return Promise.resolve(createExecutionSuccess(null));
    },

    getStatus(input: GetStatusInput) {
      const existing = executions.get(input.executionId);

      if (!existing) {
        return Promise.resolve(
          createExecutionFailure(
            "execution_not_found",
            `Execution "${input.executionId}" was not found.`
          )
        );
      }

      return Promise.resolve(createExecutionSuccess(existing));
    },

    healthCheck(): Promise<ExecutionResult<ExecutionHealthCheck>> {
      return Promise.resolve(
        createExecutionSuccess({
          checkedAt: nowIso,
          provider: "trigger",
          status: "healthy",
        })
      );
    },

    /** Test helper — mark an execution as succeeded. */
    markSuccess(executionId: string) {
      const existing = executions.get(executionId);

      if (!existing) {
        return;
      }

      executions.set(executionId, {
        ...existing,
        finishedAt: nowIso,
        status: "success",
      });
    },
  };
}

export function createMockExecutionContext(
  overrides: Partial<ExecutionContextInput> = {}
) {
  return createExecutionContext({
    actorId: "actor-1",
    companyId: "company-1",
    correlationId: "corr-execution-001",
    executionId: "exec-001",
    organizationId: "organization-1",
    source: "api",
    startedAt: defaultNowIso,
    tenantId: "tenant-1",
    ...overrides,
  });
}
