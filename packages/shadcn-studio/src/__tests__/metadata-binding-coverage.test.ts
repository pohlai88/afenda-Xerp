import { describe, expect, it } from "vitest";
import {
  assertMetadataBindingCoverage,
  summarizeMetadataBindingCoverage,
} from "../registry/assert-metadata-binding-coverage.js";
import { MCP_SEED_BLOCK_IDS } from "../registry/mcp-seed-block-manifest.js";
import { getMetadataBindingByBlockId } from "../registry/metadata-binding.registry.js";
import { getMetadataBindingWaiverByBlockId } from "../registry/metadata-binding-waiver.registry.js";

// components/ui/** primitives are excluded by design — not in MCP_SEED_BLOCK_IDS.

describe.each(
  MCP_SEED_BLOCK_IDS
)("block %s metadata binding coverage", (blockId) => {
  it("YES binding OR NO waiver (exclusive)", () => {
    const binding = getMetadataBindingByBlockId(blockId);
    const waiver = getMetadataBindingWaiverByBlockId(blockId);

    expect(Boolean(binding)).not.toBe(Boolean(waiver));
  });
});

describe("metadata binding coverage matrix", () => {
  it("assertMetadataBindingCoverage passes for full MCP manifest", () => {
    const result = assertMetadataBindingCoverage(MCP_SEED_BLOCK_IDS);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.violations.join("\n"));
    }

    expect(result.rows).toHaveLength(MCP_SEED_BLOCK_IDS.length);
  });

  it("reports YES binding count and NO waiver count", () => {
    const summary = summarizeMetadataBindingCoverage(MCP_SEED_BLOCK_IDS);

    expect(summary.total).toBe(MCP_SEED_BLOCK_IDS.length);
    expect(summary.bindingCount + summary.waiverCount).toBe(summary.total);
    expect(summary.waiverCount).toBe(8);
    expect(summary.bindingCount).toBeGreaterThan(0);
  });
});
