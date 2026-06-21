import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_SECTION_ID,
  APP_SHELL_PLACEHOLDER_RECENT_ORDERS_SECTION_ID,
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERIOD_LABEL,
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_CAPTION,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE,
  defaultAppShellPlaceholderModules,
  defaultAppShellPlaceholderOrders,
} from "./shadcn-studio/data/app-shell.placeholder.data";
import {
  DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  DEFAULT_APP_SHELL_DASHBOARD_LABEL,
  defaultAppShellDashboardInvoices,
  defaultAppShellDashboardKpiMetrics,
  defaultAppShellDashboardModuleEarnings,
  defaultAppShellDashboardPaymentHistory,
  defaultAppShellDashboardRegionalSales,
  defaultAppShellDashboardSparklineMetrics,
  defaultAppShellDashboardTransactions,
} from "./shadcn-studio/data/app-shell.dashboard.data";
import type {
  AppShellDashboardInvoiceRow,
  AppShellDashboardKpiMetric,
  AppShellDashboardModuleEarningRow,
  AppShellDashboardPaymentHistoryRow,
  AppShellDashboardRegionalSalesRow,
  AppShellDashboardSparklineMetric,
  AppShellDashboardTransactionRow,
} from "./shadcn-studio/data/app-shell.dashboard.types";
import { AppShellDashboardInvoiceTable } from "./shadcn-studio/blocks/app-shell-dashboard-invoice-table";
import { AppShellDashboardKpiStat } from "./shadcn-studio/blocks/app-shell-dashboard-kpi-stat";
import { AppShellDashboardModuleEarnings } from "./shadcn-studio/blocks/app-shell-dashboard-module-earnings";
import { AppShellDashboardPaymentHistory } from "./shadcn-studio/blocks/app-shell-dashboard-payment-history";
import { AppShellDashboardRecentTransactions } from "./shadcn-studio/blocks/app-shell-dashboard-recent-transactions";
import { AppShellDashboardRegionalSales } from "./shadcn-studio/blocks/app-shell-dashboard-regional-sales";
import { AppShellDashboardRevenueChart } from "./shadcn-studio/blocks/app-shell-dashboard-revenue-chart";
import { AppShellDashboardSparklineStat } from "./shadcn-studio/blocks/app-shell-dashboard-sparkline-stat";
import {
  ApplicationShellPlaceholderContent,
  type ApplicationShellPlaceholderProps,
} from "./app-shell.placeholder";

export type ApplicationShellDashboardGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Avatar"
  | "Badge"
  | "Button"
  | "Card"
  | "Chart"
  | "Checkbox"
  | "DropdownMenu"
  | "InputGroup"
  | "Label"
  | "Pagination"
  | "Progress"
  | "Select"
  | "Separator"
  | "Table"
  | "Tooltip"
>;

export interface ApplicationShellDashboardProps {
  readonly dashboardLabel?: string;
  readonly comparisonLabel?: string;
  readonly sparklineMetrics?: readonly AppShellDashboardSparklineMetric[];
  readonly kpiMetrics?: readonly AppShellDashboardKpiMetric[];
  readonly moduleEarnings?: readonly AppShellDashboardModuleEarningRow[];
  readonly transactions?: readonly AppShellDashboardTransactionRow[];
  readonly regionalSales?: readonly AppShellDashboardRegionalSalesRow[];
  readonly paymentHistory?: readonly AppShellDashboardPaymentHistoryRow[];
  readonly invoices?: readonly AppShellDashboardInvoiceRow[];
  readonly showLegacyWidgets?: boolean;
  readonly legacyPlaceholderProps?: ApplicationShellPlaceholderProps;
}

export function ApplicationShellDashboardContent({
  dashboardLabel = DEFAULT_APP_SHELL_DASHBOARD_LABEL,
  comparisonLabel = DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  sparklineMetrics = defaultAppShellDashboardSparklineMetrics,
  kpiMetrics = defaultAppShellDashboardKpiMetrics,
  moduleEarnings = defaultAppShellDashboardModuleEarnings,
  transactions = defaultAppShellDashboardTransactions,
  regionalSales = defaultAppShellDashboardRegionalSales,
  paymentHistory = defaultAppShellDashboardPaymentHistory,
  invoices = defaultAppShellDashboardInvoices,
  showLegacyWidgets = true,
  legacyPlaceholderProps,
}: ApplicationShellDashboardProps = {}) {
  return (
    <div aria-label={dashboardLabel} className="app-shell-dashboard" role="region">
      <div className="app-shell-sparkline-grid">
        {sparklineMetrics.map((metric) => (
          <AppShellDashboardSparklineStat
            comparisonLabel={comparisonLabel}
            key={metric.id}
            {...metric}
          />
        ))}
      </div>

      <div className="app-shell-kpi-grid">
        {kpiMetrics.map((metric) => (
          <AppShellDashboardKpiStat
            comparisonLabel={comparisonLabel}
            key={metric.id}
            {...metric}
          />
        ))}
      </div>

      <AppShellDashboardRevenueChart />

      <div className="app-shell-widget-grid">
        <AppShellDashboardModuleEarnings rows={moduleEarnings} />
        <AppShellDashboardRegionalSales rows={regionalSales} />
      </div>

      <div className="app-shell-widget-grid">
        <AppShellDashboardRecentTransactions transactions={transactions} />
        <AppShellDashboardPaymentHistory rows={paymentHistory} />
      </div>

      {showLegacyWidgets ? (
        <ApplicationShellPlaceholderContent
          dashboardLabel="ERP module widgets"
          modulePerformance={defaultAppShellPlaceholderModules}
          modulePerformanceTitle={DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE}
          modulePeriodLabel={DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERIOD_LABEL}
          recentOrders={defaultAppShellPlaceholderOrders}
          recentOrdersCaption={DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_CAPTION}
          recentOrdersTitle={DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE}
          showKpiSection={false}
          showSparklineSection={false}
          {...legacyPlaceholderProps}
        />
      ) : null}

      <AppShellDashboardInvoiceTable rows={invoices} />
    </div>
  );
}
