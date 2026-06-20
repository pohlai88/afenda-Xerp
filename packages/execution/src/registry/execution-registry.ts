import {
  createExecutionFailure,
  createExecutionSuccess,
  type ExecutionResult,
} from "../contracts/execution-result.contract.js";
import {
  DEFAULT_RETRY_POLICY,
  validateRetryPolicy,
} from "../contracts/retry-policy.contract.js";
import type {
  RegisterWorkflowInput,
  WorkflowDefinition,
} from "../contracts/workflow.contract.js";

export interface ExecutionRegistry {
  getWorkflow(workflowId: string): WorkflowDefinition | null;
  listWorkflows(): readonly WorkflowDefinition[];
  registerWorkflow(
    input: RegisterWorkflowInput
  ): ExecutionResult<WorkflowDefinition>;
}

export function createExecutionRegistry(
  initialWorkflows: readonly WorkflowDefinition[] = []
): ExecutionRegistry {
  const workflows = new Map<string, WorkflowDefinition>(
    initialWorkflows.map((workflow) => [workflow.workflowId, workflow])
  );

  return {
    getWorkflow(workflowId: string) {
      return workflows.get(workflowId) ?? null;
    },
    listWorkflows() {
      return [...workflows.values()];
    },
    registerWorkflow(input: RegisterWorkflowInput) {
      if (!input.workflowId.trim()) {
        return createExecutionFailure(
          "workflow_not_registered",
          "workflowId is required."
        );
      }

      if (!input.triggerTaskId.trim()) {
        return createExecutionFailure(
          "workflow_not_registered",
          "triggerTaskId is required."
        );
      }

      if (workflows.has(input.workflowId)) {
        return createExecutionFailure(
          "workflow_not_registered",
          `Workflow "${input.workflowId}" is already registered.`
        );
      }

      const retryPolicy = validateRetryPolicy(
        input.retryPolicy ?? DEFAULT_RETRY_POLICY
      );

      const workflow: WorkflowDefinition = {
        kind: input.kind ?? "workflow",
        retryPolicy,
        triggerTaskId: input.triggerTaskId.trim(),
        workflowId: input.workflowId.trim(),
        ...(input.description === undefined
          ? {}
          : { description: input.description }),
      };

      workflows.set(workflow.workflowId, workflow);

      return createExecutionSuccess(workflow);
    },
  };
}

export const executionRegistry = createExecutionRegistry();
