import { describe, expect, it } from "vitest";
import {
  MOCK_EXECUTION_TEST_CORRELATION_ALT_ID,
  MOCK_EXECUTION_TEST_EXECUTION_ALT_ID,
  MOCK_FIXTURE_CANONICAL_ID_BODY,
} from "../execution/execution-test-fixtures.js";
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
      correlationId: MOCK_EXECUTION_TEST_CORRELATION_ALT_ID,
      executionId: MOCK_EXECUTION_TEST_EXECUTION_ALT_ID,
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

    provider.markSuccess(context.executionId);

    const status = await provider.getStatus({
      context,
      executionId: context.executionId,
    });

    expect(status.status).toBe("success");

    if (status.status !== "success") {
      return;
    }

    expect(status.value.status).toBe("success");
  });

  it("mints a canonical execution id when executionId is omitted", () => {
    const context = createMockExecutionContext();

    expect(context.executionId).toBe(`exe_${MOCK_FIXTURE_CANONICAL_ID_BODY}`);
    expect(context.correlationId).toMatch(/^cor_/);
    expect(context.actorId).toMatch(/^usr_/);
  });
});
