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
  readonly wrapperPath?: string;
}

/** Legacy production block count from B42b inventory (excl. stories). */
export const LEGACY_APPSHELL_STUDIO_BLOCK_COUNT = 63 as const;

export const SHADCN_STUDIO_BLOCK_PARITY_REGISTRY = [
  {
    legacyAppshellExport: "AppShellAuthLoginPage04",
    legacyPath: "packages/appshell/src/auth-shell/auth-shell-entry-layout.tsx",
    mcpBlockId: "login-page-04",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/login-page-04",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/auth/login-page-04.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-application-shell-02.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dialog-activity.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/shell/application-shell-02.wrapper.tsx",
  },
  {
    legacyAppshellExport: "StatisticsRevenueCard",
    legacyPath:
      "packages/appshell/src/presentation/blocks/statistics-revenue-card.tsx",
    mcpBlockId: "statistics-component-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-card-01.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/statistics-revenue-card.wrapper.tsx",
  },
  {
    mcpBlockId: "hero-section-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/hero-section-01",
    legacyPath: "n/a — marketing surface (no legacy export)",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/marketing/hero-section-01.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings01",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-01.tsx",
    mcpBlockId: "account-settings-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-01",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-01.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings02",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-02.tsx",
    mcpBlockId: "account-settings-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-02",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-02.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings03",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-03.tsx",
    mcpBlockId: "account-settings-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-03",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-03.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings04",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-04.tsx",
    mcpBlockId: "account-settings-04",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-04",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-04.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings05",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-05.tsx",
    mcpBlockId: "account-settings-05",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-05",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-05.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings06",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-06.tsx",
    mcpBlockId: "account-settings-06",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-06",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-06.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings07",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-07.tsx",
    mcpBlockId: "account-settings-07",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-07",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/shell/app-shell-account-settings-07.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardRevenueChart",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-revenue-chart.tsx",
    mcpBlockId: "chart-component-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/chart-sales-metrics.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/revenue-chart.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardStatisticsExpenseCard",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-statistics-expense-card.tsx",
    mcpBlockId: "statistics-component-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-card-02.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/statistics-expense-card.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardInvoiceTable",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-invoice-table.tsx",
    mcpBlockId: "datatable-component-05",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/datatable-invoice.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/invoice-table.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardModuleEarnings",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-module-earnings.tsx",
    mcpBlockId: "widget-component-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/widget-total-earning.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/module-earnings.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardRecentTransactions",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-recent-transactions.tsx",
    mcpBlockId: "widget-component-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/widget-transactions.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/recent-transactions.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardPaymentHistory",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-payment-history.tsx",
    mcpBlockId: "widget-component-14",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/widget-payment-history.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/payment-history.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardKpiStat",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-kpi-stat.tsx",
    mcpBlockId: "statistics-component-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-card-03.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/kpi-stat.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardStatisticsMetrics",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-statistics-metrics.tsx",
    mcpBlockId: "statistics-component-06",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-sales-overview-card.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/statistics-metrics.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardStatisticsIncomeCard",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-statistics-income-card.tsx",
    mcpBlockId: "statistics-component-07",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-income-card.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/statistics-income-card.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardSparklineStat",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-sparkline-stat.tsx",
    mcpBlockId: "statistics-component-16",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-trend-card.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/sparkline-stat.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardStatisticsLineTrends",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-statistics-line-trends.tsx",
    mcpBlockId: "statistics-component-21",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-line-trends-card.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/statistics-line-trends.wrapper.tsx",
  },
  {
    legacyAppshellExport: "StatisticsActivityCard",
    legacyPath:
      "packages/appshell/src/presentation/blocks/statistics-activity-card.tsx",
    mcpBlockId: "statistics-component-10",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-activity-card.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/statistics-activity-card.wrapper.tsx",
  },
  {
    legacyAppshellExport: "StatisticsLeadsCard",
    legacyPath:
      "packages/appshell/src/presentation/blocks/statistics-leads-card.tsx",
    mcpBlockId: "statistics-component-10",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-leads-card.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/statistics-leads-card.wrapper.tsx",
  },
  {
    legacyAppshellExport: "StatisticsProfileTrafficCard",
    legacyPath:
      "packages/appshell/src/presentation/blocks/statistics-profile-traffic-card.tsx",
    mcpBlockId: "statistics-component-10",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-profile-traffic-card.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/statistics-profile-traffic-card.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/statistics-revenue-card.tsx",
    mcpBlockId: "statistics-component-10",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-revenue-card.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/statistics-revenue-card.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellDashboardRegionalSales",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-regional-sales.tsx",
    mcpBlockId: "widget-component-06",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/widget-sales-by-countries.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/regional-sales.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAuthErrorPage02",
    legacyPath:
      "packages/appshell/src/auth-shell/auth-shell-error-surface.client.tsx",
    mcpBlockId: "error-page-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/error-page-02",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/auth/error-page-02.wrapper.tsx",
  },
  {
    legacyAppshellExport: "SystemAdminReadinessGateMetrics",
    legacyPath:
      "packages/appshell/src/presentation/blocks/system-admin-readiness-gate-metrics.tsx",
    mcpBlockId: "statistics-component-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-card-03.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/readiness-gate-metrics.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-search-dialog.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dialog-search.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/app-shell-search-dialog.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-notification-dropdown.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dropdown-notification.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/app-shell-notification-dropdown.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-language-dropdown.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dropdown-language.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/app-shell-language-dropdown.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-profile-dropdown.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dropdown-profile.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/app-shell-profile-dropdown.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-activity-dialog.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dialog-activity.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/app-shell-activity-dialog.wrapper.tsx",
  },
  {
    mcpBlockId: "chart-component-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/chart-earning-report.tsx",
    legacyPath: "n/a — MCP chart earning report (no 1:1 legacy export)",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/chart-earning-report.wrapper.tsx",
  },
  {
    mcpBlockId: "statistics-component-09",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-orders-progress-card.tsx",
    legacyPath: "n/a — MCP statistics orders progress (bridge-only export)",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/statistics/orders-progress-card.wrapper.tsx",
  },
  {
    mcpBlockId: "statistics-component-06",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-sales-overview-card.tsx",
    legacyPath: "n/a — MCP statistics sales overview card (bridge-only export)",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/statistics/sales-overview-card.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-01/content/app-shell-account-settings-01-connect-account.tsx",
    mcpBlockId: "account-settings-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-01/content/connect-account.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-01/connect-account.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-01/content/app-shell-account-settings-01-danger-zone.tsx",
    mcpBlockId: "account-settings-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-01/content/danger-zone.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-01/danger-zone.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-01/content/app-shell-account-settings-01-email-password.tsx",
    mcpBlockId: "account-settings-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-01/content/email-password.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-01/email-password.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-01/content/app-shell-account-settings-01-personal-info.tsx",
    mcpBlockId: "account-settings-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-01/content/personal-info.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-01/personal-info.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-01/content/app-shell-account-settings-01-social-url.tsx",
    mcpBlockId: "account-settings-01",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-01/content/social-url.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-01/social-url.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-02/content/app-shell-account-settings-02-all-notifications.tsx",
    mcpBlockId: "account-settings-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-02/content/all-notifications.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-02/all-notifications.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-02/content/app-shell-account-settings-02-browser-notification.tsx",
    mcpBlockId: "account-settings-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-02/content/browser-notification.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-02/browser-notification.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-02/content/app-shell-account-settings-02-do-not-disturb.tsx",
    mcpBlockId: "account-settings-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-02/content/do-not-disturb.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-02/do-not-disturb.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-02/content/app-shell-account-settings-02-inbox-preference.tsx",
    mcpBlockId: "account-settings-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-02/content/inbox-preference.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-02/inbox-preference.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-03/content/app-shell-account-settings-03-danger-zone.tsx",
    mcpBlockId: "account-settings-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-03/content/danger-zone.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-03/danger-zone.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-03/content/app-shell-account-settings-03-workspace-data.tsx",
    mcpBlockId: "account-settings-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-03/content/workspace-data.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-03/workspace-data.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-03/content/app-shell-account-settings-03-workspace-detail.tsx",
    mcpBlockId: "account-settings-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-03/content/workspace-detail.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-03/workspace-detail.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-03/content/app-shell-account-settings-03-workspace-name.tsx",
    mcpBlockId: "account-settings-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-03/content/workspace-name.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-03/workspace-name.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-03/content/app-shell-account-settings-03-workspace-organizations.tsx",
    mcpBlockId: "account-settings-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-03/content/workspace-organizations.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-03/workspace-organizations.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-04/content/app-shell-account-settings-04-integration-section.tsx",
    mcpBlockId: "account-settings-04",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-04/content/integrations-communication.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-04/integration-section.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings06Policy",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-06-policy.tsx",
    mcpBlockId: "account-settings-06",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-06/content/api-key.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-06/policy.wrapper.tsx",
  },
  {
    legacyAppshellExport: "AppShellAccountSettings06User",
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-06-user.tsx",
    mcpBlockId: "account-settings-06",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-06/content/all-sessions.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-06/user.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-07/content/app-shell-account-settings-07-add-ons.tsx",
    mcpBlockId: "account-settings-07",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-07/content/add-ons.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-07/add-ons.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-07/content/app-shell-account-settings-07-ai-gateway.tsx",
    mcpBlockId: "account-settings-07",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-07/content/ai-gateway.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-07/ai-gateway.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-07/content/app-shell-account-settings-07-all-billing.tsx",
    mcpBlockId: "account-settings-07",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-07/content/all-billing.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-07/all-billing.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-07/content/app-shell-account-settings-07-payment-method.tsx",
    mcpBlockId: "account-settings-07",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-07/content/payment-method.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-07/payment-method.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/account-settings-07/content/app-shell-account-settings-07-spend-management.tsx",
    mcpBlockId: "account-settings-07",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-07/content/spend-management.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/account-settings-07/spend-management.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-account-settings-panel-section.tsx",
    mcpBlockId: "account-settings-06",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/account-settings-06/account-settings-06.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/account-settings/content/panel-section.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-activity-feed.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dialog-activity.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/shell/activity-feed.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-context-switcher.tsx",
    mcpBlockId: "application-shell-02",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/dropdown-profile.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/shell/context-switcher.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-breakdown.utils.tsx",
    mcpBlockId: "statistics-component-03",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-card-03.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/breakdown-utils.wrapper.ts",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-invoice-table.columns.tsx",
    mcpBlockId: "datatable-component-05",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/datatable-invoice.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/invoice-table-columns.wrapper.ts",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-dashboard-overflow-menu.tsx",
    mcpBlockId: "datatable-component-05",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/datatable-invoice.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/dashboard/invoice-table-overflow-menu.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-menu-trigger.tsx",
    mcpBlockId: "dashboard-shell-05",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/menu-trigger.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/app-shell-menu-trigger.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-module-workspace-chrome.tsx",
    mcpBlockId: "dashboard-shell-05",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/menu-trigger.tsx",
    status: "mcp-seeded",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/shell/module-workspace-chrome.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/app-shell-sidebar-user-dropdown.tsx",
    mcpBlockId: "dashboard-shell-05",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/sidebar-user-dropdown.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/app-shell-sidebar-user-dropdown.wrapper.tsx",
  },
  {
    legacyPath:
      "packages/appshell/src/presentation/blocks/statistics-line-trends-card.tsx",
    mcpBlockId: "statistics-component-21",
    mcpPath:
      "packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-line-trends-card.tsx",
    status: "bridge-exported",
    wrapperPath:
      "packages/appshell/src/presentation/wrappers/statistics-line-trends-card.wrapper.tsx",
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
    legacyBlockRoot: "packages/appshell/src/presentation/blocks",
  };
}
