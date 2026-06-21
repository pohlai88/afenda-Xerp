import { describe, expect, it } from "vitest";
import {
  createMockExecutionContext,
  createMockExecutionProvider,
} from "../execution/mock-execution-provider.js";

describe("mock execution provider", () => {
  it("implements the execution provider contract", async () => {
    const provider = createMockExecutionProvider();
    const health = await provider.healthCheck();

    expect(health.status).toBe("success");

    if (health.status !== "success") {
      return;
    }

    expect(health.value.status).toBe("healthy");
  });

  it("tracks execution lifecycle for tests", async () => {
    const provider = createMockExecutionProvider();
    const context = createMockExecutionContext({
      correlationId: "corr-mock-001",
      executionId: "exec-mock-001",
    });

    const started = await provider.execute({
      context,
      kind: "workflow",
      payload: {},
      retryPolicy: { backoffMs: 100, maxAttempts: 2 },
      triggerTaskId: "mock.task",
      workflowId: "mock.workflow",
    });

    expect(started.status).toBe("success");

    provider.markSuccess("exec-mock-001");

    const status = await provider.getStatus({
      context,
      executionId: "exec-mock-001",
    });

    expect(status.status).toBe("success");

    if (status.status !== "success") {
      return;
    }

    expect(status.value.status).toBe("success");
  });
});
