import { useId } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Badge, Card } from "@afenda/ui";
import type { GovernedBadgeProps, GovernedUiComponentName } from "@afenda/ui/governance";

import { DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL } from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardKpiMetric,
  AppShellTrendDirection,
} from "../data/app-shell.dashboard.types";

export type AppShellDashboardKpiStatGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Card"
>;

export interface AppShellDashboardKpiStatProps extends AppShellDashboardKpiMetric {
  readonly comparisonLabel?: string;
}

function resolveKpiBadgeTone(
  changePercentage: number
): NonNullable<GovernedBadgeProps["tone"]> {
  if (changePercentage > 0) {
    return "success";
  }
  if (changePercentage < 0) {
    return "danger";
  }
  return "neutral";
}

function resolveKpiTrend(changePercentage: number): AppShellTrendDirection {
  return changePercentage >= 0 ? "up" : "down";
}

function formatChangePercentage(changePercentage: number): string {
  const prefix = changePercentage > 0 ? "+" : "";
  return `${prefix}${changePercentage}%`;
}

function TrendIndicator({ trend }: { readonly trend: AppShellTrendDirection }) {
  return trend === "up" ? (
    <ChevronUpIcon aria-hidden className="app-shell-dashboard-trend-icon-up" />
  ) : (
    <ChevronDownIcon aria-hidden className="app-shell-dashboard-trend-icon-down" />
  );
}

export function AppShellDashboardKpiStat({
  title,
  badge,
  value,
  changePercentage,
  comparisonLabel = DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  Icon,
}: AppShellDashboardKpiStatProps) {
  const titleId = useId();
  const trend = resolveKpiTrend(changePercentage);
  const changeLabel = formatChangePercentage(changePercentage);

  return (
    <article
      aria-labelledby={titleId}
      className="app-shell-dashboard-widget app-shell-dashboard-kpi-widget"
    >
      <Card>
        <div className="app-shell-dashboard-kpi-body">
          <div className="app-shell-dashboard-kpi-header">
            <span className="app-shell-dashboard-kpi-title" id={titleId}>
              {title}
            </span>
            <Badge emphasis="soft" tone="neutral">
              {badge}
            </Badge>
          </div>

          <p className="app-shell-dashboard-kpi-metric">
            <span className="app-shell-dashboard-kpi-value">{value}</span>
          </p>

          <div className="app-shell-dashboard-kpi-change-row">
            <Badge emphasis="soft" tone={resolveKpiBadgeTone(changePercentage)}>
              {changeLabel}
            </Badge>
            {changePercentage !== 0 ? (
              <span className="app-shell-dashboard-kpi-trend">
                <TrendIndicator trend={trend} />
                <span className="sr-only">
                  {trend === "up" ? "Trending up" : "Trending down"}
                </span>
              </span>
            ) : null}
            <span className="app-shell-dashboard-kpi-comparison">{comparisonLabel}</span>
          </div>

          <div aria-hidden="true" className="app-shell-dashboard-kpi-watermark">
            <div className="app-shell-dashboard-kpi-icon-chip">
              <Icon className="app-shell-dashboard-kpi-watermark-icon" />
            </div>
          </div>
        </div>
      </Card>
    </article>
  );
}
