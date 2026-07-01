import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  assertBlockSlotDomMarkerCoverage,
  summarizeBlockSlotDomMarkerCoverage,
} from "../meta-gates/index.js";
import { METADATA_BINDING_REGISTRY } from "../meta-registry/metadata-binding.registry.js";

const REPO_ROOT = join(import.meta.dirname, "../../../..");

describe("block slot DOM marker coverage (P06-008-R2)", () => {
  it("assertBlockSlotDomMarkerCoverage passes for all YES-binding blocks", () => {
    const result = assertBlockSlotDomMarkerCoverage(REPO_ROOT);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.violations.join("\n"));
    }

    expect(result.rows).toHaveLength(METADATA_BINDING_REGISTRY.length);
  });

  it("summarizeBlockSlotDomMarkerCoverage reports full marker parity", () => {
    const summary = summarizeBlockSlotDomMarkerCoverage(REPO_ROOT);

    expect(summary.bindingBlockCount).toBe(METADATA_BINDING_REGISTRY.length);
    expect(summary.totalFoundMarkers).toBe(summary.totalExpectedMarkers);
    expect(summary.totalExpectedMarkers).toBeGreaterThan(0);
  });
});
