import { describe, expect, it } from "vitest";

import {
  computeStudioBlockParitySummary,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
} from "../registry/studio-block-parity.registry.js";

describe("studio block parity registry (ADR-0027)", () => {
  it("exposes serializable parity summary with legacy delete unblocked", () => {
    const summary = computeStudioBlockParitySummary();
    expect(summary.deleteBlocked).toBe(false);
    expect(summary.parityPercent).toBe(100);
    expect(summary.mcpSeededEntryCount).toBe(
      SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.length
    );
    expect(summary.canonicalBlockRoot).toContain("shadcn-studio");
    expect(summary.legacyBlockRoot).toContain("ADR-0027");
  });

  it("registry entries are JSON-serializable", () => {
    expect(() =>
      JSON.stringify(SHADCN_STUDIO_BLOCK_PARITY_REGISTRY)
    ).not.toThrow();
    expect(() =>
      JSON.stringify(computeStudioBlockParitySummary())
    ).not.toThrow();
  });
});
