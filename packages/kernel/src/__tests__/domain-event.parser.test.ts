import { describe, expect, it } from "vitest";

import {
  assertWireDomainEvent,
  type DomainEvent,
  parseUnknownDomainEvent,
  serializeDomainEvent,
} from "../events/index.js";
import {
  createTestEnterpriseId,
  parseInternalEntityPk,
} from "../identity/index.js";
import { TEST_TENANT_ID } from "./fixtures/enterprise-id.fixtures.js";

const VALID_TENANT_PK = "018f9f8c-9f1a-7c2b-9c20-000000000001";

describe("domain event wire triad", () => {
  const correlationId = createTestEnterpriseId("correlation");

  const baseEvent: DomainEvent = {
    causationId: null,
    correlationId,
    eventId: "evt-1",
    eventName: "tenant.updated",
    occurredAt: "2026-06-27T00:00:00.000Z",
    payload: { tenantId: TEST_TENANT_ID },
    schemaVersion: 1,
    tenantId: TEST_TENANT_ID,
  };

  const eventWithTenantPk: DomainEvent = {
    ...baseEvent,
    tenantPk: parseInternalEntityPk(VALID_TENANT_PK, "TenantPk"),
  };

  it("parses unknown wire payloads into typed domain events", () => {
    expect(
      parseUnknownDomainEvent({
        causationId: null,
        correlationId,
        eventId: "evt-1",
        eventName: "tenant.updated",
        occurredAt: "2026-06-27T00:00:00.000Z",
        payload: { tenantId: TEST_TENANT_ID },
        schemaVersion: 1,
        tenantId: TEST_TENANT_ID,
      })
    ).toEqual(baseEvent);

    expect(
      parseUnknownDomainEvent({
        ...serializeDomainEvent(eventWithTenantPk),
      })
    ).toEqual(eventWithTenantPk);
  });

  it("round-trips typed events through serialize and parseUnknown", () => {
    const samples: DomainEvent[] = [
      baseEvent,
      { ...baseEvent, causationId: "evt-parent", tenantId: null },
      eventWithTenantPk,
    ];

    for (const sample of samples) {
      const wire = serializeDomainEvent(sample);
      expect(parseUnknownDomainEvent(wire)).toEqual(sample);
    }
  });

  it("rejects wire payloads with unexpected keys via assertWireDomainEvent", () => {
    expect(() =>
      assertWireDomainEvent({
        ...serializeDomainEvent(baseEvent),
        extra: true,
      })
    ).toThrow(/unexpected key/i);
  });

  it("rejects malformed wire payloads before parseUnknown", () => {
    expect(() => parseUnknownDomainEvent(null)).toThrow();
    expect(() =>
      parseUnknownDomainEvent({
        ...serializeDomainEvent(baseEvent),
        correlationId: "",
      })
    ).toThrow();
    expect(() =>
      parseUnknownDomainEvent({
        ...serializeDomainEvent(baseEvent),
        tenantPk: createTestEnterpriseId("tenant"),
      })
    ).toThrow(/must not be a canonical enterprise ID/i);
  });
});
