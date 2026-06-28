/**
 * PAS-005A B42i — serializable strangler map for governed presentation wrappers.
 * Public export → MCP block id → bridge export → wrapper status.
 */

import type {
  PresentationMcpWrapperEntry,
  PresentationMcpWrapperRegistrySummary,
} from "./presentation-mcp-wrapper.types";

const WRAPPER_ROOT = "packages/appshell/src/presentation/wrappers" as const;

export const PRESENTATION_MCP_WRAPPER_REGISTRY = [
  {
    publicExportName: "StatisticsRevenueCard",
    mcpBlockId: "statistics-component-01",
    bridgeExportName: "AppShellPresentationStatisticsRevenueCard",
    status: "delegating",
    wrapperPath: `${WRAPPER_ROOT}/statistics-revenue-card.wrapper.tsx`,
  },
  {
    publicExportName: "StatisticsActivityCard",
    mcpBlockId: "statistics-component-10",
    bridgeExportName: "AppShellPresentationStatisticsActivityCard",
    status: "delegating",
    wrapperPath: `${WRAPPER_ROOT}/statistics-activity-card.wrapper.tsx`,
  },
  {
    publicExportName: "StatisticsLeadsCard",
    mcpBlockId: "statistics-component-10",
    bridgeExportName: "AppShellPresentationStatisticsLeadsCard",
    status: "delegating",
    wrapperPath: `${WRAPPER_ROOT}/statistics-leads-card.wrapper.tsx`,
  },
  {
    publicExportName: "StatisticsProfileTrafficCard",
    mcpBlockId: "statistics-component-10",
    bridgeExportName: "AppShellPresentationStatisticsProfileTrafficCard",
    status: "delegating",
    wrapperPath: `${WRAPPER_ROOT}/statistics-profile-traffic-card.wrapper.tsx`,
  },
  {
    publicExportName: "StatisticsLineTrendsCard",
    mcpBlockId: "statistics-component-21",
    bridgeExportName: "AppShellPresentationStatisticsLineTrendsCard",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/statistics-line-trends-card.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellMenuTrigger",
    mcpBlockId: "dashboard-shell-05",
    bridgeExportName: "AppShellPresentationMenuTrigger",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/app-shell-menu-trigger.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellSidebarUserDropdown",
    mcpBlockId: "dashboard-shell-05",
    bridgeExportName: "AppShellPresentationSidebarUserDropdown",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/app-shell-sidebar-user-dropdown.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardStatisticsMetrics",
    mcpBlockId: "statistics-component-10",
    bridgeExportName: "AppShellPresentationStatisticsCard01",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/statistics-metrics.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardStatisticsLineTrends",
    mcpBlockId: "statistics-component-21",
    bridgeExportName: "AppShellPresentationStatisticsLineTrendsCard",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/statistics-line-trends.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardRevenueChart",
    mcpBlockId: "chart-component-01",
    bridgeExportName: "AppShellPresentationChartSalesMetrics",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/revenue-chart.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardModuleEarnings",
    mcpBlockId: "widget-component-01",
    bridgeExportName: "AppShellPresentationWidgetTotalEarning",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/module-earnings.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardRegionalSales",
    mcpBlockId: "widget-component-06",
    bridgeExportName: "AppShellPresentationWidgetSalesByCountries",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/regional-sales.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardRecentTransactions",
    mcpBlockId: "widget-component-02",
    bridgeExportName: "AppShellPresentationWidgetTransactions",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/recent-transactions.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardPaymentHistory",
    mcpBlockId: "widget-component-03",
    bridgeExportName: "AppShellPresentationWidgetPaymentHistory",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/payment-history.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardInvoiceTable",
    mcpBlockId: "datatable-component-05",
    bridgeExportName: "AppShellPresentationDatatableInvoice",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/invoice-table.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardStatisticsIncomeCard",
    mcpBlockId: "statistics-component-07",
    bridgeExportName: "AppShellPresentationStatisticsIncomeCard",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/statistics-income-card.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardStatisticsExpenseCard",
    mcpBlockId: "statistics-component-02",
    bridgeExportName: "AppShellPresentationStatisticsCard02",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/statistics-expense-card.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellContextSwitcher",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-context-switcher.tsx`,
  },
  {
    publicExportName: "AppShellModuleWorkspaceChrome",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-module-workspace-chrome.tsx`,
  },
  {
    publicExportName: "AppShellSearchDialog",
    mcpBlockId: "application-shell-02",
    bridgeExportName: "AppShellPresentationSearchDialog",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/app-shell-search-dialog.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellNotificationDropdown",
    mcpBlockId: "application-shell-02",
    bridgeExportName: "AppShellPresentationNotificationDropdown",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/app-shell-notification-dropdown.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellLanguageDropdown",
    mcpBlockId: "application-shell-02",
    bridgeExportName: "AppShellPresentationLanguageDropdown",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/app-shell-language-dropdown.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellProfileDropdown",
    mcpBlockId: "application-shell-02",
    bridgeExportName: "AppShellPresentationProfileDropdown",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/app-shell-profile-dropdown.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellActivityDialog",
    mcpBlockId: "application-shell-02",
    bridgeExportName: "AppShellPresentationActivityDialog",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/app-shell-activity-dialog.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardKpiStat",
    mcpBlockId: "statistics-component-03",
    bridgeExportName: "AppShellPresentationStatisticsCard03",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/kpi-stat.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellDashboardSparklineStat",
    mcpBlockId: "statistics-component-16",
    bridgeExportName: "AppShellPresentationStatisticsTrendCard",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/sparkline-stat.wrapper.tsx`,
  },
  {
    publicExportName: "SystemAdminReadinessGateMetrics",
    mcpBlockId: "statistics-component-03",
    bridgeExportName: "AppShellPresentationStatisticsCard03",
    status: "governed-compose",
    wrapperPath: `${WRAPPER_ROOT}/dashboard/readiness-gate-metrics.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings01",
    mcpBlockId: "account-settings-01",
    bridgeExportName: "AppShellPresentationAccountSettings01",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-account-settings-01.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings02",
    mcpBlockId: "account-settings-02",
    bridgeExportName: "AppShellPresentationAccountSettings02",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-account-settings-02.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings03",
    mcpBlockId: "account-settings-03",
    bridgeExportName: "AppShellPresentationAccountSettings03",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-account-settings-03.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings04",
    mcpBlockId: "account-settings-04",
    bridgeExportName: "AppShellPresentationAccountSettings04",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-account-settings-04.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings05",
    mcpBlockId: "account-settings-05",
    bridgeExportName: "AppShellPresentationAccountSettings05",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-account-settings-05.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings06",
    mcpBlockId: "account-settings-06",
    bridgeExportName: "AppShellPresentationAccountSettings06",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-account-settings-06.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings07",
    mcpBlockId: "account-settings-07",
    bridgeExportName: "AppShellPresentationAccountSettings07",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../blocks/app-shell-account-settings-07.tsx`,
  },
  {
    publicExportName: "AppShellAuthLoginPage04",
    mcpBlockId: "login-page-04",
    bridgeExportName: "AppShellPresentationLoginPage04",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../../auth-shell/auth-shell-entry-layout.tsx`,
  },
  {
    publicExportName: "AppShellAuthErrorPage02",
    mcpBlockId: "error-page-02",
    bridgeExportName: "AppShellPresentationAuthErrorPage02",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../../auth-shell/auth-shell-error-surface.client.tsx`,
  },
  {
    publicExportName: "AppShellPresentationHeroSection01",
    mcpBlockId: "hero-section-01",
    bridgeExportName: "AppShellPresentationHeroSection01",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../../shadcn-studio-bridge/index.ts`,
  },
  {
    publicExportName: "AppShellPresentationStatisticsOrdersProgressCard",
    mcpBlockId: "statistics-component-09",
    bridgeExportName: "AppShellPresentationStatisticsOrdersProgressCard",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../../shadcn-studio-bridge/index.ts`,
  },
  {
    publicExportName: "AppShellPresentationStatisticsSalesOverviewCard",
    mcpBlockId: "statistics-component-06",
    bridgeExportName: "AppShellPresentationStatisticsSalesOverviewCard",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../../shadcn-studio-bridge/index.ts`,
  },
  {
    publicExportName: "AppShellPresentationChartEarningReport",
    mcpBlockId: "chart-component-02",
    bridgeExportName: "AppShellPresentationChartEarningReport",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/../../shadcn-studio-bridge/index.ts`,
  },
] as const satisfies readonly PresentationMcpWrapperEntry[];

export function computePresentationMcpWrapperSummary(
  registry: readonly PresentationMcpWrapperEntry[] = PRESENTATION_MCP_WRAPPER_REGISTRY
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

export function listDelegatingPresentationMcpWrappers(
  registry: readonly PresentationMcpWrapperEntry[] = PRESENTATION_MCP_WRAPPER_REGISTRY
): readonly PresentationMcpWrapperEntry[] {
  return registry.filter((entry) => entry.status === "delegating");
}

export function listBridgeBackedPresentationMcpWrappers(
  registry: readonly PresentationMcpWrapperEntry[] = PRESENTATION_MCP_WRAPPER_REGISTRY
): readonly PresentationMcpWrapperEntry[] {
  return registry.filter(
    (entry) =>
      entry.bridgeExportName !== undefined && entry.status !== "afenda-only"
  );
}
