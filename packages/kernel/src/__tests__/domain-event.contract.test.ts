import { describe, expect, it } from "vitest";
import { createExecutionContext } from "../contracts/execution-context.contract.js";
import type { DomainEvent } from "../events/domain-event.contract.js";
import {
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
} from "../identity/index.js";
import { TEST_TENANT_ID } from "./fixtures/enterprise-id.fixtures.js";

const FIXTURE_GENERATOR = createFixtureCanonicalIdBodyGenerator();

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
});
