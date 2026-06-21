import { Avatar, AvatarFallback, Badge, Card, Progress, Separator } from "@afenda/ui";
import type { GovernedBadgeProps, GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_COMPARISON,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_PERCENTAGE,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TITLE,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TOTAL,
  DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TREND,
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  defaultAppShellDashboardModuleEarnings,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardModuleEarningRow,
  AppShellDashboardOverflowMenuItem,
  AppShellTrendDirection,
} from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardModuleEarningsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Badge" | "Card" | "Progress" | "Separator"
>;

export interface AppShellDashboardModuleEarningsProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly total?: number;
  readonly trend?: AppShellTrendDirection;
  readonly percentage?: number;
  readonly comparisonText?: string;
  readonly rows?: readonly AppShellDashboardModuleEarningRow[];
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
}

function resolveTrendBadgeTone(
  trend: AppShellTrendDirection
): NonNullable<GovernedBadgeProps["tone"]> {
  return trend === "up" ? "success" : "danger";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatTrendPercentage(trend: AppShellTrendDirection, percentage: number): string {
  const prefix = trend === "up" ? "+" : "-";
  return `${prefix}${Math.abs(percentage)}%`;
}

function ModuleEarningRow({ row }: { readonly row: AppShellDashboardModuleEarningRow }) {
  const progressLabel = `${row.module} revenue share ${row.progress}%`;

  return (
    <li aria-label={progressLabel} className="app-shell-dashboard-earnings-row">
      <div className="app-shell-dashboard-earnings-row-main">
        <Avatar>
          <AvatarFallback>
            <div className="app-shell-dashboard-earnings-icon-frame">
              <img alt={row.iconAlt} height={24} src={row.iconSrc} width={24} />
            </div>
          </AvatarFallback>
        </Avatar>
        <div className="app-shell-dashboard-earnings-row-copy">
          <span className="app-shell-dashboard-earnings-row-title">{row.module}</span>
          <span className="app-shell-dashboard-earnings-row-subtitle">{row.subtitle}</span>
        </div>
      </div>
      <div className="app-shell-dashboard-earnings-row-metrics">
        <div className="app-shell-dashboard-earnings-row-amount-row">
          <span className="app-shell-dashboard-earnings-row-amount">{row.amount}</span>
          <span className="app-shell-dashboard-earnings-row-share">{row.progress}%</span>
        </div>
        <div className="app-shell-dashboard-earnings-progress-frame">
          <Progress aria-label={progressLabel} value={row.progress} />
        </div>
      </div>
    </li>
  );
}

export function AppShellDashboardModuleEarnings({
  title = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_SUBTITLE,
  total = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TOTAL,
  trend = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_TREND,
  percentage = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_PERCENTAGE,
  comparisonText = DEFAULT_APP_SHELL_DASHBOARD_MODULE_EARNINGS_COMPARISON,
  rows = defaultAppShellDashboardModuleEarnings,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
}: AppShellDashboardModuleEarningsProps) {
  const summaryId = "app-shell-dashboard-module-earnings-summary";
  const listId = "app-shell-dashboard-module-earnings-list";

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

        <div className="app-shell-dashboard-widget-body">
          <section
            aria-labelledby={summaryId}
            className="app-shell-dashboard-earnings-summary"
          >
            <div className="app-shell-dashboard-earnings-total-row">
              <span className="app-shell-dashboard-earnings-total" id={summaryId}>
                {formatCurrency(total)}
              </span>
              <Badge emphasis="soft" tone={resolveTrendBadgeTone(trend)}>
                {formatTrendPercentage(trend, percentage)}
              </Badge>
            </div>
            <span className="app-shell-dashboard-earnings-comparison">{comparisonText}</span>
          </section>

          <Separator />

          {rows.length === 0 ? (
            <p className="app-shell-dashboard-earnings-empty">No module revenue recorded yet.</p>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="app-shell-dashboard-earnings-list-header"
              >
                <span>Module</span>
                <span>Revenue share</span>
              </div>
              <ul
                aria-labelledby={summaryId}
                className="app-shell-dashboard-earnings-list"
                id={listId}
              >
                {rows.map((row) => (
                  <ModuleEarningRow key={row.id} row={row} />
                ))}
              </ul>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
