import { describe, expect, it } from "vitest";

import {
  computeStudioBlockParitySummary,
  LEGACY_APPSHELL_STUDIO_BLOCK_COUNT,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
} from "../registry/studio-block-parity.registry.js";

describe("studio block parity registry (B42d)", () => {
  it("documents legacy block baseline from B42b", () => {
    expect(LEGACY_APPSHELL_STUDIO_BLOCK_COUNT).toBe(63);
  });

  it("exposes serializable parity summary", () => {
    const summary = computeStudioBlockParitySummary();
    expect(summary.deleteBlocked).toBe(true);
    expect(summary.parityPercent).toBeLessThan(100);
    expect(summary.canonicalBlockRoot).toContain("shadcn-studio");
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
