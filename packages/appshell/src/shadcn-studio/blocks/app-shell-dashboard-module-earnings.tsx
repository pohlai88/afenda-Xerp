import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Avatar, AvatarFallback, Card, Progress } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_COMPARISON,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_PERCENTAGE,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TITLE,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TOTAL,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TREND,
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  defaultAppShellDashboardModuleEarnings,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardModuleEarningRow,
  AppShellTrendDirection,
} from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardModuleEarningsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Card" | "Progress"
>;

export interface AppShellDashboardModuleEarningsProps {
  readonly title?: string;
  readonly total?: number;
  readonly trend?: AppShellTrendDirection;
  readonly percentage?: number;
  readonly comparisonText?: string;
  readonly rows?: readonly AppShellDashboardModuleEarningRow[];
  readonly overflowItems?: readonly string[];
}

function TrendIndicator({ trend }: { readonly trend: AppShellTrendDirection }) {
  return trend === "up" ? (
    <ChevronUpIcon aria-hidden className="app-shell-dashboard-trend-icon-up" />
  ) : (
    <ChevronDownIcon aria-hidden className="app-shell-dashboard-trend-icon-down" />
  );
}

export function AppShellDashboardModuleEarnings({
  title = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TITLE,
  total = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TOTAL,
  trend = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TREND,
  percentage = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_PERCENTAGE,
  comparisonText = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_COMPARISON,
  rows = defaultAppShellDashboardModuleEarnings,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardModuleEarningsProps) {
  return (
    <div className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-widget-header">
          <span className="app-shell-dashboard-widget-title">{title}</span>
          <AppShellDashboardOverflowMenu items={overflowItems} />
        </div>
        <div className="app-shell-dashboard-widget-body">
          <div className="app-shell-dashboard-earnings-summary">
            <div className="app-shell-dashboard-earnings-total-row">
              <span className="app-shell-dashboard-earnings-total">
                ${total.toLocaleString("en-US")}
              </span>
              <span className="app-shell-dashboard-earnings-change">
                <TrendIndicator trend={trend} />
                <span>{percentage}%</span>
              </span>
            </div>
            <span className="app-shell-dashboard-earnings-comparison">{comparisonText}</span>
          </div>

          <ul className="app-shell-dashboard-earnings-list">
            {rows.map((row) => (
              <li className="app-shell-dashboard-earnings-row" key={row.id}>
                <div className="app-shell-dashboard-earnings-row-main">
                  <Avatar>
                    <AvatarFallback>
                      <img alt={row.iconAlt} src={row.iconSrc} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="app-shell-dashboard-earnings-row-copy">
                    <span className="app-shell-dashboard-earnings-row-title">{row.module}</span>
                    <span className="app-shell-dashboard-earnings-row-subtitle">
                      {row.subtitle}
                    </span>
                  </div>
                </div>
                <div className="app-shell-dashboard-earnings-row-metrics">
                  <span className="app-shell-dashboard-earnings-row-amount">{row.amount}</span>
                  <div className="app-shell-dashboard-earnings-progress-frame">
                    <Progress value={row.progress} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
