import { AppShellDashboardInvoiceTable } from "../shadcn-studio/blocks/app-shell-dashboard-invoice-table";
import { AppShellDashboardModuleEarnings } from "../shadcn-studio/blocks/app-shell-dashboard-module-earnings";
import { AppShellDashboardPaymentHistory } from "../shadcn-studio/blocks/app-shell-dashboard-payment-history";
import { AppShellDashboardRecentTransactions } from "../shadcn-studio/blocks/app-shell-dashboard-recent-transactions";
import { AppShellDashboardRegionalSales } from "../shadcn-studio/blocks/app-shell-dashboard-regional-sales";
import { AppShellDashboardRevenueChart } from "../shadcn-studio/blocks/app-shell-dashboard-revenue-chart";
import { AppShellDashboardStatisticsLineTrends } from "../shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends";
import { AppShellDashboardStatisticsMetrics } from "../shadcn-studio/blocks/app-shell-dashboard-statistics-metrics";
import { defaultAppShellDashboardInvoices } from "../shadcn-studio/data/app-shell.dashboard.data";
import {
  defaultAppShellDashboardModuleEarnings,
  defaultAppShellDashboardPaymentHistory,
  defaultAppShellDashboardRegionalSales,
  defaultAppShellDashboardTransactions,
} from "../shadcn-studio/data/app-shell.dashboard.data";
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
const financeTransactionsReadPermission = DASHBOARD_WIDGET_FINANCE_PERMISSIONS[2];
const dashboardModuleEarningsCapability = DASHBOARD_WIDGET_CAPABILITIES[0];
const dashboardRegionalSalesCapability = DASHBOARD_WIDGET_CAPABILITIES[1];

function hasFinanceInvoicesAccess(context: DashboardWidgetRenderContext): boolean {
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
    requiredPermission: financeInvoicesReadPermission,
    render: (context) => (
      <AppShellDashboardInvoiceTable
        rows={
          hasFinanceInvoicesAccess(context) ? defaultAppShellDashboardInvoices : []
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

export type DashboardWidgetRegistryProps = {
  readonly renderContext?: DashboardWidgetRenderContext;
};
