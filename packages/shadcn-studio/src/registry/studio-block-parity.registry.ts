/**
 * PAS-006 — shadcn-studio block inventory (ADR-0027).
 * Legacy appshell wrapper parity tracking retired; blocks live in this package only.
 */

export type StudioBlockParityStatus = "mcp-seeded" | "legacy-retired";

export interface StudioBlockParityEntry {
  readonly legacyPath: string;
  readonly mcpBlockId: string;
  readonly mcpPath: string;
  readonly status: StudioBlockParityStatus;
}

export const SHADCN_STUDIO_BLOCK_PARITY_REGISTRY = [
  {
    legacyPath: "retired — appshell bridge removed (ADR-0027)",
    mcpBlockId: "login-page-04",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/login-page-04",
    status: "mcp-seeded",
  },
  {
    legacyPath: "retired — appshell bridge removed (ADR-0027)",
    mcpBlockId: "hero-section-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/hero-section-01",
    status: "mcp-seeded",
  },
  {
    legacyPath: "retired — appshell bridge removed (ADR-0027)",
    mcpBlockId: "statistics-card-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-card-01.tsx",
    status: "mcp-seeded",
  },
  {
    legacyPath: "retired — appshell bridge removed (ADR-0027)",
    mcpBlockId: "account-settings-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-01",
    status: "mcp-seeded",
  },
  {
    legacyPath: "retired — appshell bridge removed (ADR-0027)",
    mcpBlockId: "datatable-invoice",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/datatable-invoice.tsx",
    status: "mcp-seeded",
  },
  {
    legacyPath: "retired — appshell bridge removed (ADR-0027)",
    mcpBlockId: "dialog-activity",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dialog-activity.tsx",
    status: "mcp-seeded",
  },
] as const satisfies readonly StudioBlockParityEntry[];

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
