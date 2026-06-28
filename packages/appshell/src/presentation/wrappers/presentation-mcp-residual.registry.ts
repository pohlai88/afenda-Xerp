/**
 * PAS-005A B42o — serializable strangler map for residual utility/support slices.
 * Legacy path → afenda-only wrapper path (no public @afenda/appshell export).
 */

import type {
  PresentationMcpWrapperEntry,
  PresentationMcpWrapperRegistrySummary,
} from "./presentation-mcp-wrapper.types";

const WRAPPER_ROOT = "packages/appshell/src/presentation/wrappers" as const;

export const PRESENTATION_MCP_RESIDUAL_REGISTRY = [
  {
    publicExportName: "AppShellDashboardBreakdownUtils",
    mcpBlockId: "statistics-component-03",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/breakdown-utils.wrapper.ts`,
  },
  {
    publicExportName: "AppShellDashboardInvoiceTableColumns",
    mcpBlockId: "datatable-component-05",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/invoice-table-columns.wrapper.ts`,
  },
  {
    publicExportName: "AppShellDashboardOverflowMenu",
    mcpBlockId: "datatable-component-05",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/invoice-table-overflow-menu.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellApplicationShell02SystemAdminChrome",
    mcpBlockId: "application-shell-02",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/shell/application-shell-02.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellActivityFeed",
    mcpBlockId: "application-shell-02",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/shell/activity-feed.wrapper.tsx`,
  },
] as const satisfies readonly PresentationMcpWrapperEntry[];

export function computePresentationMcpResidualSummary(
  registry: readonly PresentationMcpWrapperEntry[] = PRESENTATION_MCP_RESIDUAL_REGISTRY
): PresentationMcpWrapperRegistrySummary {
  return {
    entryCount: registry.length,
    delegatingCount: registry.filter((entry) => entry.status === "delegating")
      .length,
    governedComposeCount: registry.filter(
      (entry) => entry.status === "governed-compose"
    ).length,
    afendaOnlyCount: registry.filter((entry) => entry.status === "afenda-only")
      .length,
  };
}
