import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  computeStudioBlockParitySummary,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
} from "../meta-registry/studio-block-parity.registry.js";

const REPO_ROOT = join(import.meta.dirname, "../../../..");

describe("studio block parity (ADR-0027)", () => {
  it("maps every mcpPath to an on-disk block under shadcn-studio", () => {
    for (const entry of SHADCN_STUDIO_BLOCK_PARITY_REGISTRY) {
      expect(existsSync(join(REPO_ROOT, entry.mcpPath))).toBe(true);
    }
  });

  it("exposes serializable parity summary with legacy delete unblocked", () => {
    const summary = computeStudioBlockParitySummary();
    expect(summary.deleteBlocked).toBe(false);
    expect(summary.parityPercent).toBe(100);
    expect(() => JSON.stringify(summary)).not.toThrow();
  });
});
