/**
 * PAS-006 — shadcn-studio block inventory (ADR-0027).
 * Legacy appshell wrapper parity tracking retired; blocks live in this package only.
 */

import { MCP_SEED_BLOCK_MANIFEST } from "./mcp-seed-block-manifest.js";

export type StudioBlockParityStatus = "mcp-seeded" | "legacy-retired";

export interface StudioBlockParityEntry {
  readonly legacyPath: string;
  readonly mcpBlockId: string;
  readonly mcpPath: string;
  readonly status: StudioBlockParityStatus;
}

export const SHADCN_STUDIO_BLOCK_PARITY_REGISTRY = MCP_SEED_BLOCK_MANIFEST.map(
  (entry) =>
    ({
      legacyPath: "retired — appshell bridge removed (ADR-0027)",
      mcpBlockId: entry.blockId,
      mcpPath: entry.mcpPath,
      status: "mcp-seeded",
    }) satisfies StudioBlockParityEntry
);

export interface StudioBlockParitySummary {
  readonly canonicalBlockRoot: string;
  readonly deleteBlocked: boolean;
  readonly legacyBlockRoot: string;
  readonly mcpSeededEntryCount: number;
  readonly parityPercent: number;
  readonly seededBlockCount: number;
}

export function computeStudioBlockParitySummary(
  registry: readonly StudioBlockParityEntry[] = SHADCN_STUDIO_BLOCK_PARITY_REGISTRY
): StudioBlockParitySummary {
  const mcpSeededEntryCount = registry.filter(
    (entry) => entry.status === "mcp-seeded"
  ).length;

  return {
    seededBlockCount: registry.length,
    mcpSeededEntryCount,
    parityPercent: 100,
    deleteBlocked: false,
    canonicalBlockRoot:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks",
    legacyBlockRoot: "retired per ADR-0027 (packages/appshell removed)",
  };
}
