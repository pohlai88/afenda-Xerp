import { toDomainEventFromOutboxRecord } from "@afenda/execution";
import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { mapDrizzleOutboxRowToRecord } from "../drizzle-outbox-persistence.adapter.js";

const VALID_TENANT_PK = "018f9f8c-9f1a-7c2b-9c20-000000000001";

describe("drizzle outbox domain event bridge", () => {
  it("maps drizzle row shape to OutboxEventRecord consumable by kernel bridge", () => {
    const correlationId = createTestEnterpriseId("correlation");

    const record = mapDrizzleOutboxRowToRecord({
      actorId: "actor-1",
      actorType: "user",
      attempts: 0,
      availableAt: new Date("2026-06-23T00:00:00.000Z"),
      causationId: null,
      companyId: "company-pk",
      correlationId,
      createdAt: new Date("2026-06-23T00:00:00.000Z"),
      eventId: "evt-001",
      eventType: "workspace.dashboard.layout.updated",
      eventVersion: "1.0",
      executionRunId: null,
      failedAt: null,
      id: VALID_TENANT_PK,
      lastError: null,
      lockedAt: null,
      lockedBy: null,
      maxAttempts: 3,
      metadata: { module: "workspace" },
      organizationId: null,
      payload: { widgetCount: 2 },
      publishedAt: null,
      reason: null,
      status: "pending",
      summary: null,
      tenantId: VALID_TENANT_PK,
      updatedAt: new Date("2026-06-23T00:00:00.000Z"),
    });

    const domainEvent = toDomainEventFromOutboxRecord(record);

    expect(domainEvent.eventName).toBe("workspace.dashboard.layout.updated");
    expect(domainEvent.tenantId).toBeNull();
    expect(domainEvent.tenantPk).toBeDefined();
    expect(domainEvent.correlationId).toBe(correlationId);
  });

  it("rejects rows whose correlationId is not canonical at bridge boundary", () => {
    const record = mapDrizzleOutboxRowToRecord({
      actorId: "actor-1",
      actorType: "user",
      attempts: 0,
      availableAt: new Date("2026-06-23T00:00:00.000Z"),
      causationId: null,
      companyId: "company-pk",
      correlationId: "corr-non-canonical",
      createdAt: new Date("2026-06-23T00:00:00.000Z"),
      eventId: "evt-002",
      eventType: "workspace.dashboard.layout.updated",
      eventVersion: "1.0",
      executionRunId: null,
      failedAt: null,
      id: VALID_TENANT_PK,
      lastError: null,
      lockedAt: null,
      lockedBy: null,
      maxAttempts: 3,
      metadata: {},
      organizationId: null,
      payload: { widgetCount: 1 },
      publishedAt: null,
      reason: null,
      status: "pending",
      summary: null,
      tenantId: VALID_TENANT_PK,
      updatedAt: new Date("2026-06-23T00:00:00.000Z"),
    });

    expect(() => toDomainEventFromOutboxRecord(record)).toThrow();
  });
});
