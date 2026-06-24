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
      className="app-shell-dashboard-widget app-shell-studio-metric-card"
      data-emphasis={emphasis}
    >
      <Card>
        <div className="app-shell-studio-metric__body">
          <div className="app-shell-studio-metric__header">
            <div className="app-shell-studio-metric__heading">
              <span className="app-shell-studio-metric__title" id={titleId}>
                {title}
              </span>
              <span className="app-shell-studio-metric__caption">{badge}</span>
            </div>
            <div aria-hidden="true" className="app-shell-studio-icon-chip">
              <Icon className="app-shell-studio-icon-chip__icon" />
            </div>
          </div>

          <p
            aria-describedby={footnoteId}
            className="app-shell-studio-metric__value-group"
          >
            <span className="app-shell-studio-metric__value">{value}</span>
          </p>

          <p className="app-shell-studio-metric__footnote" id={footnoteId}>
            <span className="app-shell-studio-metric__change">
              {changeLabel}
            </span>
            <span className="app-shell-studio-metric__comparison">
              {comparisonLabel}
            </span>
          </p>
        </div>
      </Card>
    </article>
  );
}
