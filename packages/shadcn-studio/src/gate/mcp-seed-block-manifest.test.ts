import { describe, expect, it } from "vitest";

import {
  MCP_SEED_BLOCK_IDS,
  MCP_SEED_BLOCK_MANIFEST,
} from "../meta-registry/mcp-seed-block-manifest.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "../meta-registry/studio-block-parity.registry.js";

describe("mcp seed block manifest (PAS-006B parity SSOT)", () => {
  it("parity registry covers full MCP manifest", () => {
    expect(SHADCN_STUDIO_BLOCK_PARITY_REGISTRY).toHaveLength(
      MCP_SEED_BLOCK_MANIFEST.length
    );
    expect(MCP_SEED_BLOCK_IDS.length).toBeGreaterThanOrEqual(30);

    for (const entry of MCP_SEED_BLOCK_MANIFEST) {
      expect(
        SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.some(
          (parity) => parity.mcpBlockId === entry.blockId
        )
      ).toBe(true);
    }
  });
});
