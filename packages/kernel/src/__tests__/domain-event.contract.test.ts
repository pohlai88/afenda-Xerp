import { describe, expect, it } from "vitest";
import { createExecutionContext } from "../contracts/execution-context.contract.js";
import type { DomainEvent } from "../events/domain-event.contract.js";
import {
  normalizeDomainEventForWire,
  parseUnknownDomainEvent,
  serializeDomainEvent,
} from "../events/index.js";
import {
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
  parseInternalEntityPk,
} from "../identity/index.js";
import { TEST_TENANT_ID } from "./fixtures/enterprise-id.fixtures.js";

const FIXTURE_GENERATOR = createFixtureCanonicalIdBodyGenerator();
const VALID_TENANT_PK = "018f9f8c-9f1a-7c2b-9c20-000000000001";

describe("domain event contract", () => {
  it("accepts DomainEvent envelope as JSON-serializable wire shape", () => {
    const correlationId = createTestEnterpriseId("correlation");
    const execution = createExecutionContext({
      correlationId,
      canonicalIdBodyGenerator: FIXTURE_GENERATOR,
      source: "event",
    });

    const event: DomainEvent = {
      causationId: null,
      correlationId: execution.correlationId,
      eventId: "evt-1",
      eventName: "tenant.updated",
      occurredAt: "2026-06-27T00:00:00.000Z",
      payload: { tenantId: TEST_TENANT_ID },
      schemaVersion: 1,
      tenantId: null,
    };

    expect(JSON.parse(JSON.stringify(event))).toEqual({
      ...event,
      correlationId,
    });
  });

  it("accepts optional tenantPk on typed DomainEvent", () => {
    const correlationId = createTestEnterpriseId("correlation");
    const tenantPk = parseInternalEntityPk(VALID_TENANT_PK, "TenantPk");

    const event: DomainEvent = {
      causationId: null,
      correlationId,
      eventId: "evt-2",
      eventName: "tenant.updated",
      occurredAt: "2026-06-27T00:00:00.000Z",
      payload: { status: "active" },
      schemaVersion: 1,
      tenantId: TEST_TENANT_ID,
      tenantPk,
    };

    const wire = serializeDomainEvent(event);
    expect(wire.tenantPk).toBe(VALID_TENANT_PK);
    expect(parseUnknownDomainEvent(wire)).toEqual(event);
    expect(normalizeDomainEventForWire(event)).toEqual(wire);
  });
});
