import { describe, expect, it } from "vitest";
import {
  assertExecutionContext,
  createExecutionContext,
  createExecutionId,
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
  EXECUTION_CONTEXT_REQUIRED_FIELDS,
  EXECUTION_CONTEXT_SOURCES,
  isExecutionContext,
  isExecutionContextSource,
  parseExecutionContextWire,
  parseTenantId,
  serializeExecutionContext,
} from "../index.js";
import { TEST_TENANT_ID } from "./fixtures/enterprise-id.fixtures.js";

const ISO_TIMESTAMP_PREFIX = /^\d{4}-\d{2}-\d{2}T/;
const FIXTURE_GENERATOR = createFixtureCanonicalIdBodyGenerator();

function createValidContextInput() {
  return {
    correlationId: createTestEnterpriseId("correlation"),
    executionId: createExecutionId(FIXTURE_GENERATOR),
    source: "api" as const,
    tenantId: TEST_TENANT_ID,
  };
}

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

  it("exports PAS §4.3 required field registry", () => {
    expect(EXECUTION_CONTEXT_REQUIRED_FIELDS).toEqual([
      "executionId",
      "correlationId",
      "source",
      "startedAt",
      "actorId",
      "tenantId",
      "companyId",
      "organizationId",
    ]);
  });

  it("keeps source vocabulary parity with EXECUTION_CONTEXT_SOURCES", () => {
    const approvedSources = [
      "api",
      "cron",
      "event",
      "manual",
      "system",
      "outbox",
      "job",
    ] as const;

    expect([...EXECUTION_CONTEXT_SOURCES]).toEqual([...approvedSources]);
    for (const source of approvedSources) {
      expect(isExecutionContextSource(source)).toBe(true);
    }
  });

  it("accepts all approved sources via isExecutionContext", () => {
    for (const source of EXECUTION_CONTEXT_SOURCES) {
      const context = createExecutionContext({
        ...createValidContextInput(),
        source,
      });
      expect(isExecutionContext(context)).toBe(true);
    }
  });

  it("rejects invalid source via isExecutionContext and assertExecutionContext", () => {
    const context = createExecutionContext(createValidContextInput());
    const invalid = { ...context, source: "websocket" as never };

    expect(isExecutionContext(invalid)).toBe(false);
    expect(() => assertExecutionContext(invalid)).toThrow(
      /missing required PAS §4.3 fields/
    );
  });

  it("preserves shape through JSON wire round-trip", () => {
    const context = createExecutionContext({
      ...createValidContextInput(),
      source: "event",
      traceId: "trace-1",
      spanId: "span-1",
    });

    const wire = serializeExecutionContext(context);
    const parsed = JSON.parse(JSON.stringify(wire)) as typeof wire;
    const roundTripped = parseExecutionContextWire(parsed);

    expect(roundTripped).toEqual(context);
    expect(assertExecutionContext(roundTripped)).toEqual(context);
  });

  it("assertExecutionContext rejects incomplete payloads", () => {
    const context = createExecutionContext(createValidContextInput());
    const { startedAt: _startedAt, ...incomplete } = context;

    expect(isExecutionContext(incomplete)).toBe(false);
    expect(() => assertExecutionContext(incomplete as typeof context)).toThrow(
      /missing required PAS §4.3 fields/
    );
  });
});
