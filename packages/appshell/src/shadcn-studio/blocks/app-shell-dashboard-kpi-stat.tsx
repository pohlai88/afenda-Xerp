import { Card } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";

import { DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL } from "../data/app-shell.dashboard.data";
import type { AppShellDashboardKpiMetric } from "../data/app-shell.dashboard.types";

export type AppShellDashboardKpiStatGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card"
>;

export interface AppShellDashboardKpiStatProps
  extends AppShellDashboardKpiMetric {
  readonly comparisonLabel?: string;
  readonly emphasis?: "default" | "primary";
}

export function formatChangePercentage(changePercentage: number): string {
  const prefix = changePercentage > 0 ? "+" : "";
  return `${prefix}${changePercentage}%`;
}

export function AppShellDashboardKpiStat({
  title,
  badge,
  value,
  changePercentage,
  comparisonLabel = DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  Icon,
  emphasis = "default",
}: AppShellDashboardKpiStatProps) {
  const titleId = useId();
  const footnoteId = useId();
  const changeLabel = formatChangePercentage(changePercentage);

  return (
    <article
      aria-labelledby={titleId}
      className="app-shell-dashboard-widget app-shell-dashboard-kpi-widget"
      data-emphasis={emphasis}
    >
      <Card>
        <div className="app-shell-dashboard-kpi-body">
          <div className="app-shell-dashboard-kpi-header">
            <div className="app-shell-dashboard-kpi-heading">
              <span className="app-shell-dashboard-kpi-title" id={titleId}>
                {title}
              </span>
              <span className="app-shell-dashboard-kpi-caption">{badge}</span>
            </div>
            <div
              aria-hidden="true"
              className="app-shell-dashboard-kpi-icon-chip"
            >
              <Icon className="app-shell-dashboard-kpi-icon" />
            </div>
          </div>

          <p
            aria-describedby={footnoteId}
            className="app-shell-dashboard-kpi-metric"
          >
            <span className="app-shell-dashboard-kpi-value">{value}</span>
          </p>

          <p className="app-shell-dashboard-kpi-footnote" id={footnoteId}>
            <span className="app-shell-dashboard-kpi-change">
              {changeLabel}
            </span>
            <span className="app-shell-dashboard-kpi-comparison">
              {comparisonLabel}
            </span>
          </p>
        </div>
      </Card>
    </article>
  );
}
