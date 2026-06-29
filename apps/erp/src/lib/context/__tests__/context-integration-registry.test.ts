import { describe, expect, it } from "vitest";

import {
  AUTH_ACTOR_BRIDGE_WIRING,
  AUTH_SESSION_BRIDGE_WIRING,
  CONTEXT_INTEGRATION_WIRING,
  METADATA_PAS006_CONSUMER_WIRING,
  TENANT_LIFECYCLE_BRIDGE_WIRING,
} from "../context-integration-registry";

describe("context-integration-registry", () => {
  it("declares unique ids across all wiring arrays", () => {
    const allEntries = [
      ...CONTEXT_INTEGRATION_WIRING,
      ...AUTH_SESSION_BRIDGE_WIRING,
      ...AUTH_ACTOR_BRIDGE_WIRING,
      ...TENANT_LIFECYCLE_BRIDGE_WIRING,
      ...METADATA_PAS006_CONSUMER_WIRING,
    ];
    const ids = allEntries.map((entry) => entry.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes IS-002 spine and PAS-006 presentation shell entries", () => {
    expect(
      CONTEXT_INTEGRATION_WIRING.some(
        (entry) => entry.id === "operating-context-spine"
      )
    ).toBe(true);
    expect(
      CONTEXT_INTEGRATION_WIRING.some(
        (entry) => entry.id === "presentation-shell-context"
      )
    ).toBe(true);
  });

  it("retains B111 tenant lifecycle bridge entries", () => {
    expect(TENANT_LIFECYCLE_BRIDGE_WIRING).toHaveLength(3);
  });

  it("declares PAS-001A R1c metadata PAS-006 consumer wiring", () => {
    expect(METADATA_PAS006_CONSUMER_WIRING).toHaveLength(4);
    expect(
      METADATA_PAS006_CONSUMER_WIRING.some(
        (entry) => entry.id === "metadata-binding-slot-hydration"
      )
    ).toBe(true);
  });
});
