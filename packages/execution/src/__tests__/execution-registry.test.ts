import { describe, expect, it } from "vitest";
import { createExecutionRegistry, createExecutionSuccess } from "../index.js";

describe("execution registry", () => {
  it("registers a workflow with default retry policy", () => {
    const registry = createExecutionRegistry();
    const result = registry.registerWorkflow({
      triggerTaskId: "platform.health-check",
      workflowId: "platform.health-check",
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value.retryPolicy.maxAttempts).toBe(3);
    expect(registry.getWorkflow("platform.health-check")).toEqual(result.value);
  });

  it("rejects duplicate workflow registration", () => {
    const registry = createExecutionRegistry();
    registry.registerWorkflow({
      triggerTaskId: "platform.health-check",
      workflowId: "platform.health-check",
    });

    const duplicate = registry.registerWorkflow({
      triggerTaskId: "platform.health-check",
      workflowId: "platform.health-check",
    });

    expect(duplicate.status).toBe("workflow_not_registered");
  });

  it("lists registered workflows", () => {
    const registry = createExecutionRegistry([
      {
        kind: "workflow",
        retryPolicy: { backoffMs: 500, maxAttempts: 2 },
        triggerTaskId: "task-a",
        workflowId: "workflow-a",
      },
    ]);

    registry.registerWorkflow({
      triggerTaskId: "task-b",
      workflowId: "workflow-b",
    });

    expect(registry.listWorkflows()).toHaveLength(2);
    expect(
      registry.listWorkflows().map((workflow) => workflow.workflowId)
    ).toEqual(["workflow-a", "workflow-b"]);
  });

  it("returns null for unknown workflows", () => {
    const registry = createExecutionRegistry();
    expect(registry.getWorkflow("missing")).toBeNull();
  });

  it("validates retry policy during registration", () => {
    const registry = createExecutionRegistry();

    expect(() =>
      registry.registerWorkflow({
        retryPolicy: { backoffMs: -1, maxAttempts: 1 },
        triggerTaskId: "task-a",
        workflowId: "workflow-a",
      })
    ).toThrow("retryPolicy.backoffMs");
  });

  it("returns success result shape for valid registration", () => {
    const registry = createExecutionRegistry();
    const result = registry.registerWorkflow({
      description: "Foundation workflow",
      kind: "manual",
      triggerTaskId: "foundation.manual",
      workflowId: "foundation.manual",
    });

    expect(result).toEqual(
      createExecutionSuccess({
        description: "Foundation workflow",
        kind: "manual",
        retryPolicy: {
          backoffMs: 1000,
          backoffMultiplier: 2,
          maxAttempts: 3,
        },
        triggerTaskId: "foundation.manual",
        workflowId: "foundation.manual",
      })
    );
  });
});
