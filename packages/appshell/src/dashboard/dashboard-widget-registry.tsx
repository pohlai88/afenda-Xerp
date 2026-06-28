import {
  defaultAppShellDashboardInvoices,
  defaultAppShellDashboardModuleEarnings,
  defaultAppShellDashboardPaymentHistory,
  defaultAppShellDashboardRegionalSales,
  defaultAppShellDashboardTransactions,
} from "../presentation/data/app-shell.dashboard.data";
import { AppShellDashboardInvoiceTable } from "../presentation/wrappers/dashboard/invoice-table.wrapper";
import { AppShellDashboardModuleEarnings } from "../presentation/wrappers/dashboard/module-earnings.wrapper";
import { AppShellDashboardPaymentHistory } from "../presentation/wrappers/dashboard/payment-history.wrapper";
import { AppShellDashboardRecentTransactions } from "../presentation/wrappers/dashboard/recent-transactions.wrapper";
import { AppShellDashboardRegionalSales } from "../presentation/wrappers/dashboard/regional-sales.wrapper";
import { AppShellDashboardRevenueChart } from "../presentation/wrappers/dashboard/revenue-chart.wrapper";
import { AppShellDashboardStatisticsLineTrends } from "../presentation/wrappers/dashboard/statistics-line-trends.wrapper";
import { AppShellDashboardStatisticsMetrics } from "../presentation/wrappers/dashboard/statistics-metrics.wrapper";
import {
  createKpiMetricWidgetDefinitions,
  createSparklineMetricWidgetDefinitions,
} from "./dashboard-metric-widget-definitions";
import type {
  DashboardWidgetDefinition,
  DashboardWidgetId,
  DashboardWidgetRenderContext,
} from "./dashboard-widget.contract";
import {
  DASHBOARD_WIDGET_CAPABILITIES,
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS,
} from "./dashboard-widget.contract";

const financeInvoicesReadPermission = DASHBOARD_WIDGET_FINANCE_PERMISSIONS[0];
const financeCardsReadPermission = DASHBOARD_WIDGET_FINANCE_PERMISSIONS[1];
const financeTransactionsReadPermission =
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS[2];
const dashboardModuleEarningsCapability = DASHBOARD_WIDGET_CAPABILITIES[0];
const dashboardRegionalSalesCapability = DASHBOARD_WIDGET_CAPABILITIES[1];

function hasFinanceInvoicesAccess(
  context: DashboardWidgetRenderContext
): boolean {
  return context.permissions.has(financeInvoicesReadPermission);
}

export const DASHBOARD_WIDGET_DEFINITIONS = [
  ...createSparklineMetricWidgetDefinitions(),
  ...createKpiMetricWidgetDefinitions(),
  {
    id: "statistics-metrics",
    title: "Statistics metrics",
    description: "Revenue, leads, activity, and profile traffic metrics.",
    category: "chart",
    minW: 4,
    minH: 3,
    defaultW: 12,
    defaultH: 3,
    maxW: 12,
    maxH: 6,
    render: (_context) => <AppShellDashboardStatisticsMetrics />,
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
    maxW: 12,
    maxH: 6,
    render: (_context) => <AppShellDashboardStatisticsLineTrends />,
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
    maxW: 12,
    maxH: 8,
    render: (_context) => <AppShellDashboardRevenueChart />,
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
    maxW: 12,
    maxH: 8,
    requiredCapability: dashboardModuleEarningsCapability,
    render: (context) => (
      <AppShellDashboardModuleEarnings
        rows={
          context.capabilities.has(dashboardModuleEarningsCapability)
            ? defaultAppShellDashboardModuleEarnings
            : []
        }
      />
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
    maxW: 12,
    maxH: 8,
    requiredCapability: dashboardRegionalSalesCapability,
    render: (context) => (
      <AppShellDashboardRegionalSales
        rows={
          context.capabilities.has(dashboardRegionalSalesCapability)
            ? defaultAppShellDashboardRegionalSales
            : []
        }
      />
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
    maxW: 12,
    maxH: 8,
    requiredPermission: financeTransactionsReadPermission,
    render: (context) => (
      <AppShellDashboardRecentTransactions
        transactions={
          context.permissions.has(financeTransactionsReadPermission)
            ? defaultAppShellDashboardTransactions
            : []
        }
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
    maxW: 12,
    maxH: 8,
    requiredPermission: financeCardsReadPermission,
    render: (context) => (
      <AppShellDashboardPaymentHistory
        rows={
          context.permissions.has(financeCardsReadPermission)
            ? defaultAppShellDashboardPaymentHistory
            : []
        }
      />
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
    maxW: 12,
    maxH: 10,
    requiredPermission: financeInvoicesReadPermission,
    render: (context) => (
      <AppShellDashboardInvoiceTable
        rows={
          hasFinanceInvoicesAccess(context)
            ? defaultAppShellDashboardInvoices
            : []
        }
      />
    ),
  },
] as const satisfies readonly DashboardWidgetDefinition[];

export const DASHBOARD_WIDGET_REGISTRY = new Map<
  DashboardWidgetId,
  DashboardWidgetDefinition
>(
  DASHBOARD_WIDGET_DEFINITIONS.map((definition) => [definition.id, definition])
);

const DASHBOARD_WIDGET_ID_SET: ReadonlySet<string> = new Set(
  DASHBOARD_WIDGET_DEFINITIONS.map((definition) => definition.id)
);

export function isDashboardWidgetId(value: string): value is DashboardWidgetId {
  return DASHBOARD_WIDGET_ID_SET.has(value);
}

export function getDashboardWidgetRegistry(): ReadonlyMap<
  DashboardWidgetId,
  DashboardWidgetDefinition
> {
  return DASHBOARD_WIDGET_REGISTRY;
}

export interface DashboardWidgetRegistryProps {
  readonly renderContext?: DashboardWidgetRenderContext;
}
