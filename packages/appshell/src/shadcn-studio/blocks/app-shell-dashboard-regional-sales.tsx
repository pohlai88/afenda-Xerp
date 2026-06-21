import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Card } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_TITLE,
  defaultAppShellDashboardRegionalSales,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardRegionalSalesRow,
  AppShellTrendDirection,
} from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardRegionalSalesGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card"
>;

export interface AppShellDashboardRegionalSalesProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly rows?: readonly AppShellDashboardRegionalSalesRow[];
  readonly overflowItems?: readonly string[];
}

function TrendIndicator({ trend }: { readonly trend: AppShellTrendDirection }) {
  return trend === "up" ? (
    <ChevronUpIcon aria-hidden className="app-shell-dashboard-trend-icon-up" />
  ) : (
    <ChevronDownIcon aria-hidden className="app-shell-dashboard-trend-icon-down" />
  );
}

export function AppShellDashboardRegionalSales({
  title = DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_REGIONAL_SALES_SUBTITLE,
  rows = defaultAppShellDashboardRegionalSales,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardRegionalSalesProps) {
  return (
    <div className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-widget-header app-shell-dashboard-widget-header-stacked">
          <div className="app-shell-dashboard-widget-heading">
            <span className="app-shell-dashboard-widget-title">{title}</span>
            <span className="app-shell-dashboard-widget-subtitle">{subtitle}</span>
          </div>
          <AppShellDashboardOverflowMenu items={overflowItems} />
        </div>
        <ul className="app-shell-dashboard-regional-list">
          {rows.map((row) => (
            <li className="app-shell-dashboard-regional-row" key={row.id}>
              <div className="app-shell-dashboard-regional-main">
                <div className="app-shell-dashboard-regional-flag-frame">
                  <img alt={row.flagAlt} src={row.flagSrc} />
                </div>
                <div className="app-shell-dashboard-regional-copy">
                  <span className="app-shell-dashboard-regional-amount">{row.amount}</span>
                  <span className="app-shell-dashboard-regional-name">{row.region}</span>
                </div>
              </div>
              <span className="app-shell-dashboard-regional-change">
                <TrendIndicator trend={row.trend} />
                <span>{row.changeLabel}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
