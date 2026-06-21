import { describe, expect, it } from "vitest";
import {
  assertExecutionContext,
  createExecutionContext,
  createExecutionId,
  type CorrelationId,
} from "../index.js";

const ISO_TIMESTAMP_PREFIX = /^\d{4}-\d{2}-\d{2}T/;

describe("execution context contract", () => {
  it("creates execution context with generated identifiers", () => {
    const context = createExecutionContext({
      correlationId: "corr-kernel-001",
      source: "event",
      tenantId: "tenant-1",
    });

    expect(context.executionId.startsWith("exec-")).toBe(true);
    expect(context.correlationId).toBe("corr-kernel-001");
    expect(context.startedAt).toMatch(ISO_TIMESTAMP_PREFIX);
  });

  it("asserts required identifiers", () => {
    const context = createExecutionContext({
      correlationId: "corr-1",
      executionId: createExecutionId(),
      source: "manual",
    });

    expect(assertExecutionContext(context)).toEqual(context);
  });

  it("rejects empty correlation identifiers", () => {
    expect(() =>
      assertExecutionContext({
        actorId: null,
        companyId: null,
        correlationId: "   " as CorrelationId,
        executionId: createExecutionId(),
        organizationId: null,
        source: "api",
        startedAt: "2026-06-20T00:00:00.000Z",
        tenantId: null,
      })
    ).toThrow("correlationId");
  });
});
