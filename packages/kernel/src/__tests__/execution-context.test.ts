import { describe, expect, it } from "vitest";
import {
  assertExecutionContext,
  createExecutionContext,
  createExecutionId,
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
  parseTenantId,
} from "../index.js";
import { TEST_TENANT_ID } from "./fixtures/enterprise-id.fixtures.js";

const ISO_TIMESTAMP_PREFIX = /^\d{4}-\d{2}-\d{2}T/;
const FIXTURE_GENERATOR = createFixtureCanonicalIdBodyGenerator();

describe("execution context contract", () => {
  it("creates execution context with generated identifiers", () => {
    const correlationId = createTestEnterpriseId("correlation");
    const context = createExecutionContext({
      correlationId,
      canonicalIdBodyGenerator: FIXTURE_GENERATOR,
      source: "event",
      tenantId: TEST_TENANT_ID,
      traceId: "trace-1",
      spanId: "span-1",
    });

    expect(context.executionId.startsWith("exe_")).toBe(true);
    expect(context.correlationId).toBe(correlationId);
    expect(context.traceId).toBe("trace-1");
    expect(context.spanId).toBe("span-1");
    expect(context.startedAt).toMatch(ISO_TIMESTAMP_PREFIX);
    expect(parseTenantId(context.tenantId as string)).toBe(TEST_TENANT_ID);
  });

  it("defaults trace and span identifiers to null", () => {
    const context = createExecutionContext({
      correlationId: createTestEnterpriseId("correlation"),
      canonicalIdBodyGenerator: FIXTURE_GENERATOR,
      source: "api",
    });

    expect(context.traceId).toBeNull();
    expect(context.spanId).toBeNull();
  });

  it("asserts required identifiers", () => {
    const context = createExecutionContext({
      correlationId: createTestEnterpriseId("correlation"),
      executionId: createExecutionId(FIXTURE_GENERATOR),
      source: "manual",
    });

    expect(assertExecutionContext(context)).toEqual(context);
  });

  it("rejects empty correlation identifiers", () => {
    expect(() =>
      createExecutionContext({
        correlationId: "   ",
        executionId: createExecutionId(FIXTURE_GENERATOR),
        source: "api",
      })
    ).toThrow();
  });

  it("rejects implicit execution id minting without a generator", () => {
    expect(() =>
      createExecutionContext({
        correlationId: createTestEnterpriseId("correlation"),
        source: "api",
      })
    ).toThrow(/canonicalIdBodyGenerator is required/);
  });
});
