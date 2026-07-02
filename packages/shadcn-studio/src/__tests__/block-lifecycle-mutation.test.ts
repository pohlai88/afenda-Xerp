import { describe, expect, it } from "vitest";

import {
  BLOCK_LIFECYCLE_REGISTRY,
  buildInitialBlockLifecycleRegistry,
  transitionBlockLifecycleEntry,
  transitionBlockLifecycleRegistry,
} from "../meta-registry/block-lifecycle-mutation.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "../meta-registry/studio-block-parity.registry.js";

describe("block lifecycle mutation (PAS-006B P06-004)", () => {
  it("initial registry covers parity blocks at imported", () => {
    expect(BLOCK_LIFECYCLE_REGISTRY).toHaveLength(
      SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.length
    );
    expect(
      BLOCK_LIFECYCLE_REGISTRY.every(
        (entry) => entry.lifecycleState === "imported"
      )
    ).toBe(true);
    expect(() => JSON.stringify(BLOCK_LIFECYCLE_REGISTRY)).not.toThrow();
  });

  it("rejects invalid lifecycle skips", () => {
    const entry = {
      blockId: "login-page-04",
      lifecycleState: "imported" as const,
    };

    expect(transitionBlockLifecycleEntry(entry, "stabilized")).toEqual({
      ok: false,
      code: "invalid-transition",
      blockId: "login-page-04",
      from: "imported",
      to: "stabilized",
    });
  });

  it("advances one lifecycle step forward", () => {
    const entry = {
      blockId: "hero-section-01",
      lifecycleState: "imported" as const,
    };

    const result = transitionBlockLifecycleEntry(entry, "normalized");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.entry.lifecycleState).toBe("normalized");
    }
  });

  it("mutates registry immutably on valid transition", () => {
    const initial = buildInitialBlockLifecycleRegistry();
    const { registry: next, result } = transitionBlockLifecycleRegistry(
      initial,
      "login-page-04",
      "normalized"
    );

    expect(result.ok).toBe(true);
    expect(initial[0]?.lifecycleState).toBe("imported");
    expect(
      next.find((entry) => entry.blockId === "login-page-04")?.lifecycleState
    ).toBe("normalized");
  });
});
