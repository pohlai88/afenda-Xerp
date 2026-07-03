/**
 * PAS-006B — MCP live seed block manifest (filesystem SSOT for parity registry).
 */

export interface McpSeedBlockManifestEntry {
  readonly blockId: string;
  readonly mcpPath: string;
}

const BLOCKS_ROOT = "packages/shadcn-studio/src/components-layouts" as const;

export const MCP_SEED_BLOCK_MANIFEST = [
  {
    blockId: "account-settings-01",
    mcpPath: `${BLOCKS_ROOT}/account-settings-01`,
  },
  {
    blockId: "chart-earning-report",
    mcpPath: `${BLOCKS_ROOT}/chart-earning-report.tsx`,
  },
  {
    blockId: "chart-sales-metrics",
    mcpPath: `${BLOCKS_ROOT}/chart-sales-metrics.tsx`,
  },
  {
    blockId: "chart-total-revenue",
    mcpPath: `${BLOCKS_ROOT}/chart-total-revenue.tsx`,
  },
  {
    blockId: "dashboard-dialog-03",
    mcpPath: `${BLOCKS_ROOT}/dashboard-dialog-03`,
  },
  {
    blockId: "dashboard-dialog-09",
    mcpPath: `${BLOCKS_ROOT}/dashboard-dialog-09`,
  },
  {
    blockId: "datatable-invoice",
    mcpPath: `${BLOCKS_ROOT}/datatable-invoice.tsx`,
  },
  {
    blockId: "datatable-user",
    mcpPath: `${BLOCKS_ROOT}/datatable-user.tsx`,
  },
  {
    blockId: "datatable-product",
    mcpPath: `${BLOCKS_ROOT}/datatable-product.tsx`,
  },
  {
    blockId: "dialog-activity",
    mcpPath: `${BLOCKS_ROOT}/dialog-activity.tsx`,
  },
  {
    blockId: "dialog-search",
    mcpPath: `${BLOCKS_ROOT}/dialog-search.tsx`,
  },
  {
    blockId: "dropdown-language",
    mcpPath: `${BLOCKS_ROOT}/dropdown-language.tsx`,
  },
  {
    blockId: "dropdown-notification",
    mcpPath: `${BLOCKS_ROOT}/dropdown-notification.tsx`,
  },
  {
    blockId: "dropdown-profile",
    mcpPath: `${BLOCKS_ROOT}/dropdown-profile.tsx`,
  },
  {
    blockId: "error-page-shell",
    mcpPath: `${BLOCKS_ROOT}/error-page-shell.tsx`,
  },
  { blockId: "hero-section-01", mcpPath: `${BLOCKS_ROOT}/hero-section-01` },
  { blockId: "menu-trigger", mcpPath: `${BLOCKS_ROOT}/menu-trigger.tsx` },
  {
    blockId: "sidebar-user-dropdown",
    mcpPath: `${BLOCKS_ROOT}/sidebar-user-dropdown.tsx`,
  },
  {
    blockId: "statistics-activity-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-activity-card.tsx`,
  },
  {
    blockId: "statistics-card-01",
    mcpPath: `${BLOCKS_ROOT}/statistics-card-01.tsx`,
  },
  {
    blockId: "statistics-card-02",
    mcpPath: `${BLOCKS_ROOT}/statistics-card-02.tsx`,
  },
  {
    blockId: "statistics-card-03",
    mcpPath: `${BLOCKS_ROOT}/statistics-card-03.tsx`,
  },
  {
    blockId: "statistics-card-04",
    mcpPath: `${BLOCKS_ROOT}/statistics-card-04.tsx`,
  },
  {
    blockId: "statistics-expense-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-expense-card.tsx`,
  },
  {
    blockId: "statistics-income-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-income-card.tsx`,
  },
  {
    blockId: "statistics-leads-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-leads-card.tsx`,
  },
  {
    blockId: "statistics-line-trends-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-line-trends-card.tsx`,
  },
  {
    blockId: "statistics-orders-progress-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-orders-progress-card.tsx`,
  },
  {
    blockId: "statistics-profile-traffic-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-profile-traffic-card.tsx`,
  },
  {
    blockId: "statistics-revenue-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-revenue-card.tsx`,
  },
  {
    blockId: "statistics-sales-overview-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-sales-overview-card.tsx`,
  },
  {
    blockId: "statistics-trend-card",
    mcpPath: `${BLOCKS_ROOT}/statistics-trend-card.tsx`,
  },
  {
    blockId: "widget-payment-history",
    mcpPath: `${BLOCKS_ROOT}/widget-payment-history.tsx`,
  },
  {
    blockId: "widget-sales-by-countries",
    mcpPath: `${BLOCKS_ROOT}/widget-sales-by-countries.tsx`,
  },
  {
    blockId: "widget-total-earning",
    mcpPath: `${BLOCKS_ROOT}/widget-total-earning.tsx`,
  },
  {
    blockId: "widget-transactions",
    mcpPath: `${BLOCKS_ROOT}/widget-transactions.tsx`,
  },
] as const satisfies readonly McpSeedBlockManifestEntry[];

export type McpSeedBlockId =
  (typeof MCP_SEED_BLOCK_MANIFEST)[number]["blockId"];

export const MCP_SEED_BLOCK_IDS = MCP_SEED_BLOCK_MANIFEST.map(
  (entry) => entry.blockId
) as readonly McpSeedBlockId[];
