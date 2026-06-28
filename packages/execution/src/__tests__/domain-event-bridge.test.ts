import { serializeDomainEvent } from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import {
  outboxRecordToWireDomainEvent,
  parseOutboxEventSchemaVersion,
  toDomainEventFromOutboxEnvelope,
  toDomainEventFromOutboxRecord,
} from "../contracts/domain-event-bridge.contract.js";
import {
  OUTBOX_EVENT_VERSION,
  type OutboxEventRecord,
  toOutboxEventEnvelope,
} from "../contracts/outbox-event.contract.js";
import {
  EXECUTION_TEST_CORRELATION_ID,
  EXECUTION_TEST_FIXTURE_GENERATOR,
  EXECUTION_TEST_TENANT_ID,
} from "./execution-test-fixtures.js";

const VALID_TENANT_PK = "018f9f8c-9f1a-7c2b-9c20-000000000001";

function createPendingRecord(
  overrides: Partial<OutboxEventRecord> = {}
): OutboxEventRecord {
  return {
    actorId: null,
    actorType: "system",
    attempts: 0,
    availableAt: "2026-06-23T00:00:00.000Z",
    causationId: null,
    companyId: null,
    correlationId: EXECUTION_TEST_CORRELATION_ID,
    eventId: "evt-001",
    eventType: "workspace.updated",
    eventVersion: OUTBOX_EVENT_VERSION,
    executionRunId: null,
    id: "row-001",
    lockedAt: null,
    lockedBy: null,
    maxAttempts: 3,
    metadata: { source: "test" },
    organizationId: null,
    payload: { label: "dashboard" },
    reason: null,
    status: "pending",
    summary: null,
    tenantId: EXECUTION_TEST_TENANT_ID,
    ...overrides,
  };
}

describe("domain event bridge", () => {
  it("parses outbox event version major into schemaVersion", () => {
    expect(parseOutboxEventSchemaVersion("1.0")).toBe(1);
    expect(parseOutboxEventSchemaVersion("2.3")).toBe(2);
    expect(() => parseOutboxEventSchemaVersion("0.1")).toThrow();
  });

  it("maps outbox record to wire domain event with canonical tenantId", () => {
    const record = createPendingRecord();

    expect(outboxRecordToWireDomainEvent(record)).toEqual({
      causationId: null,
      correlationId: EXECUTION_TEST_CORRELATION_ID,
      eventId: "evt-001",
      eventName: "workspace.updated",
      occurredAt: "2026-06-23T00:00:00.000Z",
      payload: { label: "dashboard" },
      schemaVersion: 1,
      tenantId: EXECUTION_TEST_TENANT_ID,
    });
  });

  it("maps internal tenant PK rows to tenantPk with null canonical tenantId", () => {
    const record = createPendingRecord({
      tenantId: VALID_TENANT_PK,
    });

    const domainEvent = toDomainEventFromOutboxRecord(record);

    expect(domainEvent.tenantId).toBeNull();
    expect(domainEvent.tenantPk).toBeDefined();
    expect(serializeDomainEvent(domainEvent).tenantPk).toBe(VALID_TENANT_PK);
  });

  it("round-trips outbox envelope through kernel domain event parser", () => {
    const record = createPendingRecord({
      metadata: { tenantPk: VALID_TENANT_PK },
    });
    const envelope = toOutboxEventEnvelope(record, {
      canonicalIdBodyGenerator: EXECUTION_TEST_FIXTURE_GENERATOR,
    });

    const domainEvent = toDomainEventFromOutboxEnvelope(envelope);

    expect(domainEvent.eventName).toBe("workspace.updated");
    expect(domainEvent.correlationId).toBe(EXECUTION_TEST_CORRELATION_ID);
    expect(domainEvent.tenantId).toBe(EXECUTION_TEST_TENANT_ID);
    expect(domainEvent.tenantPk).toBeDefined();
  });

  it("rejects conflicting tenant PK sources", () => {
    expect(() =>
      toDomainEventFromOutboxRecord(
        createPendingRecord({
          metadata: { tenantPk: VALID_TENANT_PK },
          tenantId: "018f9f8c-9f1a-7c2b-9c20-000000000002",
        })
      )
    ).toThrow(/conflicts with metadata\.tenantPk/i);
  });
});
