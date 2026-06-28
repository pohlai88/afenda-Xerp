/**
 * PAS-005A B42d — serializable studio block parity registry.
 * Machine-readable strangler cutover map; legacy delete remains blocked until parityPercent reaches 100.
 */

export type StudioBlockParityStatus =
  | "legacy-only"
  | "mcp-seeded"
  | "bridge-exported";

export interface StudioBlockParityEntry {
  readonly legacyAppshellExport?: string;
  readonly legacyPath: string;
  readonly mcpBlockId?: string;
  readonly mcpPath?: string;
  readonly status: StudioBlockParityStatus;
}

/** Legacy production block count from B42b inventory (excl. stories). */
export const LEGACY_APPSHELL_STUDIO_BLOCK_COUNT = 63 as const;

export const SHADCN_STUDIO_BLOCK_PARITY_REGISTRY = [
  {
    legacyAppshellExport: "AppShellAuthLoginPage04",
    legacyPath:
      "packages/appshell/src/shadcn-studio/blocks/app-shell-auth-login-page-04.tsx",
    mcpBlockId: "login-page-04",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/login-page-04",
    status: "bridge-exported",
  },
  {
    legacyPath:
      "packages/appshell/src/shadcn-studio/blocks/app-shell-application-shell-02.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dialog-activity.tsx",
    status: "mcp-seeded",
  },
  {
    legacyAppshellExport: "StatisticsRevenueCard",
    legacyPath:
      "packages/appshell/src/shadcn-studio/blocks/statistics-revenue-card.tsx",
    mcpBlockId: "statistics-component-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-card-01.tsx",
    status: "mcp-seeded",
  },
  {
    mcpBlockId: "hero-section-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/hero-section-01",
    legacyPath: "n/a — marketing surface (no legacy export)",
    status: "bridge-exported",
  },
] as const satisfies readonly StudioBlockParityEntry[];

export interface StudioBlockParitySummary {
  readonly bridgeExportedEntryCount: number;
  readonly canonicalBlockRoot: string;
  readonly deleteBlocked: boolean;
  readonly legacyBlockRoot: string;
  readonly legacyProductionBlockCount: number;
  readonly mcpSeededEntryCount: number;
  readonly parityPercent: number;
}

export function computeStudioBlockParitySummary(
  registry: readonly StudioBlockParityEntry[] = SHADCN_STUDIO_BLOCK_PARITY_REGISTRY
): StudioBlockParitySummary {
  const mcpSeededEntryCount = registry.filter(
    (entry) => entry.status === "mcp-seeded"
  ).length;
  const bridgeExportedEntryCount = registry.filter(
    (entry) => entry.status === "bridge-exported"
  ).length;
  const coveredCount = mcpSeededEntryCount + bridgeExportedEntryCount;
  const parityPercent = Math.round(
    (coveredCount / LEGACY_APPSHELL_STUDIO_BLOCK_COUNT) * 100
  );

  return {
    legacyProductionBlockCount: LEGACY_APPSHELL_STUDIO_BLOCK_COUNT,
    mcpSeededEntryCount,
    bridgeExportedEntryCount,
    parityPercent,
    deleteBlocked: coveredCount < LEGACY_APPSHELL_STUDIO_BLOCK_COUNT,
    canonicalBlockRoot:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks",
    legacyBlockRoot: "packages/appshell/src/shadcn-studio/blocks",
  };
}
