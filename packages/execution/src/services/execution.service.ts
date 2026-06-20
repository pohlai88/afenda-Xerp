import type { AuditEventPersistenceAdapter } from "@afenda/observability";
import { withAuditEvidence } from "@afenda/observability";
import type {
  CancelInput,
  ExecuteInput,
  ExecutionAuditAction,
  ExecutionHandle,
  ExecutionStatusRecord,
  GetStatusInput,
  RetryInput,
  ScheduleInput,
} from "../contracts/execution.contract.js";
import { EXECUTION_AUDIT_ACTIONS } from "../contracts/execution.contract.js";
import {
  assertExecutionContext,
  type ExecutionContext,
} from "../contracts/execution-context.contract.js";
import type { ExecutionProvider } from "../contracts/execution-provider.contract.js";
import {
  createExecutionFailure,
  type ExecutionResult,
  isExecutionSuccess,
} from "../contracts/execution-result.contract.js";
import {
  resolveScheduleCron,
  type ScheduleDefinition,
  validateScheduleDefinition,
} from "../contracts/schedule.contract.js";
import type {
  RegisterWorkflowInput,
  ScheduleHandle,
  WorkflowDefinition,
} from "../contracts/workflow.contract.js";
import { unavailableTriggerProvider } from "../providers/trigger.provider.js";
import {
  createExecutionRegistry,
  type ExecutionRegistry,
} from "../registry/execution-registry.js";

export interface ExecutionServiceDependencies {
  readonly auditAdapter?: AuditEventPersistenceAdapter | null;
  readonly provider?: ExecutionProvider;
  readonly registry?: ExecutionRegistry;
}

export interface ExecutionService {
  cancel(input: CancelInput): Promise<ExecutionResult<null>>;
  execute(input: ExecuteInput): Promise<ExecutionResult<ExecutionHandle>>;
  getStatus(
    input: GetStatusInput
  ): Promise<ExecutionResult<ExecutionStatusRecord>>;
  registerWorkflow(
    input: RegisterWorkflowInput
  ): ExecutionResult<WorkflowDefinition>;
  retry(input: RetryInput): Promise<ExecutionResult<ExecutionHandle>>;
  schedule(input: ScheduleInput): Promise<ExecutionResult<ScheduleHandle>>;
}

async function protectExecutionCall<TValue>(
  operation: () => Promise<ExecutionResult<TValue>>
): Promise<ExecutionResult<TValue>> {
  try {
    return await operation();
  } catch (error: unknown) {
    return createExecutionFailure(
      "provider_error",
      error instanceof Error ? error.message : "Execution operation failed."
    );
  }
}

function buildAuditEvidence(
  context: ExecutionContext,
  action: ExecutionAuditAction,
  targetId: string
) {
  return {
    action,
    actorId: context.actorId,
    actorType: "system" as const,
    companyId: context.companyId,
    correlationId: context.correlationId,
    metadata: {
      executionId: context.executionId,
      source: context.source,
    },
    module: "execution",
    organizationId: context.organizationId,
    source: "job" as const,
    targetId,
    targetType: "execution",
    tenantId: context.tenantId,
  };
}

export function createExecutionService(
  dependencies: ExecutionServiceDependencies = {}
): ExecutionService {
  const provider = dependencies.provider ?? unavailableTriggerProvider;
  const registry = dependencies.registry ?? createExecutionRegistry();
  const auditAdapter = dependencies.auditAdapter ?? null;

  return {
    registerWorkflow(input: RegisterWorkflowInput) {
      return registry.registerWorkflow(input);
    },

    execute(input: ExecuteInput) {
      return protectExecutionCall(async () => {
        const context = assertExecutionContext(input.context);
        const workflow = registry.getWorkflow(input.workflowId);

        if (!workflow) {
          return createExecutionFailure(
            "workflow_not_registered",
            `Workflow "${input.workflowId}" is not registered.`
          );
        }

        const executionKind = input.kind ?? workflow.kind;

        await withAuditEvidence(
          buildAuditEvidence(
            context,
            EXECUTION_AUDIT_ACTIONS.WORKFLOW_STARTED,
            input.workflowId
          ),
          async () => true,
          auditAdapter
        );

        const started = await withAuditEvidence(
          buildAuditEvidence(
            context,
            EXECUTION_AUDIT_ACTIONS.EXECUTION_STARTED,
            context.executionId
          ),
          async () =>
            provider.execute({
              context,
              kind: executionKind,
              payload: input.payload ?? {},
              retryPolicy: workflow.retryPolicy,
              triggerTaskId: workflow.triggerTaskId,
              workflowId: workflow.workflowId,
            }),
          auditAdapter
        );

        const result = started.value;

        if (!isExecutionSuccess(result)) {
          await withAuditEvidence(
            buildAuditEvidence(
              context,
              EXECUTION_AUDIT_ACTIONS.WORKFLOW_FAILED,
              input.workflowId
            ),
            async () => true,
            auditAdapter
          );

          await withAuditEvidence(
            buildAuditEvidence(
              context,
              EXECUTION_AUDIT_ACTIONS.EXECUTION_FAILED,
              context.executionId
            ),
            async () => true,
            auditAdapter
          );

          return result;
        }

        if (result.value.status === "success") {
          await withAuditEvidence(
            buildAuditEvidence(
              context,
              EXECUTION_AUDIT_ACTIONS.WORKFLOW_COMPLETED,
              input.workflowId
            ),
            async () => true,
            auditAdapter
          );

          await withAuditEvidence(
            buildAuditEvidence(
              context,
              EXECUTION_AUDIT_ACTIONS.EXECUTION_COMPLETED,
              context.executionId
            ),
            async () => true,
            auditAdapter
          );
        }

        return result;
      });
    },

    schedule(input: ScheduleInput) {
      return protectExecutionCall(async () => {
        const context = assertExecutionContext(input.context);

        let scheduleDefinition: ScheduleDefinition;

        try {
          scheduleDefinition = validateScheduleDefinition(input.schedule);
        } catch (error: unknown) {
          return createExecutionFailure(
            "invalid_schedule",
            error instanceof Error ? error.message : "Invalid schedule."
          );
        }

        const workflow = registry.getWorkflow(scheduleDefinition.workflowId);

        if (!workflow) {
          return createExecutionFailure(
            "workflow_not_registered",
            `Workflow "${scheduleDefinition.workflowId}" is not registered.`
          );
        }

        const cron = resolveScheduleCron(scheduleDefinition);
        const deduplicationKey =
          scheduleDefinition.deduplicationKey ??
          `${scheduleDefinition.workflowId}:${scheduleDefinition.scheduleId}`;

        return await provider.schedule({
          context,
          cron,
          deduplicationKey,
          scheduleId: scheduleDefinition.scheduleId,
          triggerTaskId: workflow.triggerTaskId,
          workflowId: workflow.workflowId,
          ...(scheduleDefinition.timezone === undefined
            ? {}
            : { timezone: scheduleDefinition.timezone }),
        });
      });
    },

    retry(input: RetryInput) {
      return protectExecutionCall(async () => {
        const context = assertExecutionContext(input.context);
        const workflow = registry.getWorkflow(input.workflowId);

        if (!workflow) {
          return createExecutionFailure(
            "workflow_not_registered",
            `Workflow "${input.workflowId}" is not registered.`
          );
        }

        const retried = await withAuditEvidence(
          buildAuditEvidence(
            context,
            EXECUTION_AUDIT_ACTIONS.EXECUTION_RETRIED,
            input.executionId
          ),
          async () =>
            provider.retry({
              context,
              executionId: input.executionId,
              retryPolicy: workflow.retryPolicy,
              triggerTaskId: workflow.triggerTaskId,
              workflowId: workflow.workflowId,
            }),
          auditAdapter
        );

        return retried.value;
      });
    },

    cancel(input: CancelInput) {
      return protectExecutionCall(async () => {
        const context = assertExecutionContext(input.context);

        const cancelled = await withAuditEvidence(
          buildAuditEvidence(
            context,
            EXECUTION_AUDIT_ACTIONS.EXECUTION_CANCELLED,
            input.executionId
          ),
          async () => provider.cancel(input),
          auditAdapter
        );

        return cancelled.value;
      });
    },

    getStatus(input: GetStatusInput) {
      return protectExecutionCall(async () => {
        assertExecutionContext(input.context);
        return await provider.getStatus(input);
      });
    },
  };
}

export const executionService = createExecutionService();
