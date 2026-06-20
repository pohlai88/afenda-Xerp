import { describe, expect, it } from "vitest";
import {
  createExecutionContext,
  EXECUTION_KINDS,
  EXECUTION_STATUSES,
  type ExecutionOutboxEnvelope,
  isExecutionJsonValue,
  isExecutionPayload,
} from "../index.js";

describe("execution vocabulary governance", () => {
  it("defines required execution kinds", () => {
    expect(EXECUTION_KINDS).toEqual([
      "job",
      "workflow",
      "schedule",
      "retry",
      "event_driven",
      "manual",
    ]);
  });

  it("defines required execution statuses aligned with database enum", () => {
    expect(EXECUTION_STATUSES).toEqual([
      "success",
      "failure",
      "retrying",
      "cancelled",
      "blocked",
      "timed_out",
    ]);
  });
});

describe("serializable execution contracts", () => {
  it("accepts JSON-safe execution payloads", () => {
    const payload = {
      attempt: 1,
      enabled: true,
      label: "foundation",
      tags: ["platform"],
      meta: { source: "test" },
    } as const;

    expect(isExecutionPayload(payload)).toBe(true);
    expect(isExecutionJsonValue(null)).toBe(true);
    expect(isExecutionJsonValue(undefined)).toBe(false);
    expect(isExecutionJsonValue(() => undefined)).toBe(false);
  });

  it("supports outbox envelope round-trip", () => {
    const envelope: ExecutionOutboxEnvelope = {
      correlationId: "corr-outbox-001",
      eventType: "execution.requested",
      executionContext: createExecutionContext({
        correlationId: "corr-outbox-001",
        source: "outbox",
        tenantId: "tenant-1",
      }),
      payload: { workflowId: "foundation.health-check" },
    };

    const serialized = JSON.stringify(envelope);
    const parsed = JSON.parse(serialized) as ExecutionOutboxEnvelope;

    expect(parsed.eventType).toBe("execution.requested");
    expect(parsed.executionContext.correlationId).toBe("corr-outbox-001");
    expect(isExecutionPayload(parsed.payload)).toBe(true);
  });
});
