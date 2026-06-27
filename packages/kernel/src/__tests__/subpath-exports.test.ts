import { describe, expect, it } from "vitest";

import type { DomainEvent } from "../events/index.js";
import type { PolicyDecisionKind } from "../policy/index.js";
import { kernelContext } from "../propagation/index.js";

describe("@afenda/kernel subpath exports", () => {
  it("exposes propagation runtime from ./propagation", () => {
    expect(kernelContext.get()).toBeNull();
    expect(typeof kernelContext.run).toBe("function");
    expect(typeof kernelContext.fork).toBe("function");
  });

  it("exposes policy vocabulary types from ./policy", () => {
    const decision: PolicyDecisionKind = "allow";
    expect(decision).toBe("allow");
  });

  it("exposes domain event envelope from ./events", () => {
    const event: DomainEvent = {
      causationId: null,
      correlationId: "corr-1" as DomainEvent["correlationId"],
      eventId: "evt-1",
      eventName: "tenant.created",
      occurredAt: "2026-01-01T00:00:00.000Z",
      payload: { tenantSlug: "acme" },
      schemaVersion: 1,
      tenantId: null,
    };

    expect(JSON.parse(JSON.stringify(event)).eventName).toBe("tenant.created");
  });
});
