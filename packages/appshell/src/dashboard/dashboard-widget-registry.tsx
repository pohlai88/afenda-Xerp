import {
  DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  defaultAppShellDashboardInvoices,
  defaultAppShellDashboardKpiMetrics,
  defaultAppShellDashboardModuleEarnings,
  defaultAppShellDashboardPaymentHistory,
  defaultAppShellDashboardRegionalSales,
  defaultAppShellDashboardSparklineMetrics,
  defaultAppShellDashboardTransactions,
} from "../shadcn-studio/data/app-shell.dashboard.data";
import { AppShellDashboardInvoiceTable } from "../shadcn-studio/blocks/app-shell-dashboard-invoice-table";
import { AppShellDashboardKpiStat } from "../shadcn-studio/blocks/app-shell-dashboard-kpi-stat";
import { AppShellDashboardModuleEarnings } from "../shadcn-studio/blocks/app-shell-dashboard-module-earnings";
import { AppShellDashboardPaymentHistory } from "../shadcn-studio/blocks/app-shell-dashboard-payment-history";
import { AppShellDashboardRecentTransactions } from "../shadcn-studio/blocks/app-shell-dashboard-recent-transactions";
import { AppShellDashboardRegionalSales } from "../shadcn-studio/blocks/app-shell-dashboard-regional-sales";
import { AppShellDashboardRevenueChart } from "../shadcn-studio/blocks/app-shell-dashboard-revenue-chart";
import { AppShellDashboardSparklineStat } from "../shadcn-studio/blocks/app-shell-dashboard-sparkline-stat";
import { AppShellDashboardStatisticsLineTrends } from "../shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends";
import { AppShellDashboardStatisticsMetrics } from "../shadcn-studio/blocks/app-shell-dashboard-statistics-metrics";
import type {
  DashboardWidgetDefinition,
  DashboardWidgetId,
  DashboardWidgetRenderContext,
} from "./dashboard-widget.contract";

const comparisonLabel = DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL;

export const DASHBOARD_WIDGET_DEFINITIONS = [
  {
    id: "sparkline-stats",
    title: "Sparkline metrics",
    description: "Expense and revenue sparkline overview cards.",
    category: "kpi",
    minW: 4,
    minH: 2,
    defaultW: 12,
    defaultH: 2,
    render: () => (
      <div className="app-shell-sparkline-grid">
        {defaultAppShellDashboardSparklineMetrics.map((metric) => (
          <AppShellDashboardSparklineStat
            comparisonLabel={comparisonLabel}
            key={metric.id}
            {...metric}
          />
        ))}
      </div>
    ),
  },
  {
    id: "kpi-stats",
    title: "KPI metrics",
    description: "Primary KPI cards with trend badges.",
    category: "kpi",
    minW: 4,
    minH: 2,
    defaultW: 12,
    defaultH: 2,
    render: () => (
      <div className="app-shell-kpi-grid">
        {defaultAppShellDashboardKpiMetrics.map((metric) => (
          <AppShellDashboardKpiStat
            comparisonLabel={comparisonLabel}
            key={metric.id}
            {...metric}
          />
        ))}
      </div>
    ),
  },
  {
    id: "statistics-metrics",
    title: "Statistics metrics",
    description: "Revenue, leads, activity, and profile traffic metrics.",
    category: "chart",
    minW: 4,
    minH: 3,
    defaultW: 12,
    defaultH: 3,
    render: () => <AppShellDashboardStatisticsMetrics />,
  },
  {
    id: "statistics-line-trends",
    title: "Line trend metrics",
    description: "Orders, gross revenue, and inventory movement trends.",
    category: "chart",
    minW: 4,
    minH: 3,
    defaultW: 12,
    defaultH: 3,
    render: () => <AppShellDashboardStatisticsLineTrends />,
  },
  {
    id: "revenue-chart",
    title: "Revenue chart",
    description: "Year-over-year revenue comparison chart.",
    category: "chart",
    minW: 4,
    minH: 3,
    defaultW: 12,
    defaultH: 4,
    render: () => <AppShellDashboardRevenueChart />,
  },
  {
    id: "module-earnings",
    title: "Module earnings",
    description: "Module earnings progress and change indicators.",
    category: "activity",
    minW: 3,
    minH: 3,
    defaultW: 6,
    defaultH: 4,
    render: () => (
      <AppShellDashboardModuleEarnings rows={defaultAppShellDashboardModuleEarnings} />
    ),
  },
  {
    id: "regional-sales",
    title: "Regional sales",
    description: "Regional revenue ranking and trend summary.",
    category: "activity",
    minW: 3,
    minH: 3,
    defaultW: 6,
    defaultH: 4,
    render: () => (
      <AppShellDashboardRegionalSales rows={defaultAppShellDashboardRegionalSales} />
    ),
  },
  {
    id: "recent-transactions",
    title: "Recent transactions",
    description: "Latest payment transactions across modules.",
    category: "activity",
    minW: 3,
    minH: 3,
    defaultW: 6,
    defaultH: 4,
    render: () => (
      <AppShellDashboardRecentTransactions
        transactions={defaultAppShellDashboardTransactions}
      />
    ),
  },
  {
    id: "payment-history",
    title: "Payment history",
    description: "Corporate card spend and remaining balances.",
    category: "activity",
    minW: 3,
    minH: 3,
    defaultW: 6,
    defaultH: 4,
    render: () => (
      <AppShellDashboardPaymentHistory rows={defaultAppShellDashboardPaymentHistory} />
    ),
  },
  {
    id: "invoice-table",
    title: "Accounts receivable",
    description: "Invoice table with sorting and bulk actions.",
    category: "table",
    minW: 4,
    minH: 4,
    defaultW: 12,
    defaultH: 5,
    render: () => (
      <AppShellDashboardInvoiceTable rows={defaultAppShellDashboardInvoices} />
    ),
  },
] as const satisfies readonly DashboardWidgetDefinition[];

export const DASHBOARD_WIDGET_REGISTRY = new Map<
  DashboardWidgetId,
  DashboardWidgetDefinition
>(
  DASHBOARD_WIDGET_DEFINITIONS.map((definition) => [definition.id, definition])
);

export function getDashboardWidgetRegistry(): ReadonlyMap<
  DashboardWidgetId,
  DashboardWidgetDefinition
> {
  return DASHBOARD_WIDGET_REGISTRY;
}

export type DashboardWidgetRegistryProps = {
  readonly renderContext?: DashboardWidgetRenderContext;
};
