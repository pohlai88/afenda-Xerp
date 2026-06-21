import { Badge, Card } from "@afenda/ui";
import type { GovernedBadgeProps, GovernedUiComponentName } from "@afenda/ui/governance";

import type { AppShellDashboardKpiMetric } from "../data/app-shell.dashboard.types";

export type AppShellDashboardKpiStatGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Card"
>;

export interface AppShellDashboardKpiStatProps extends AppShellDashboardKpiMetric {}

function resolveKpiBadgeTone(
  changePercentage: number
): NonNullable<GovernedBadgeProps["tone"]> {
  if (changePercentage >= 0) {
    return "success";
  }
  return "danger";
}

function formatChangePercentage(changePercentage: number): string {
  const prefix = changePercentage > 0 ? "+" : "";
  return `${prefix}${changePercentage}%`;
}

export function AppShellDashboardKpiStat({
  title,
  badge,
  value,
  changePercentage,
  Icon,
}: AppShellDashboardKpiStatProps) {
  return (
    <div className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-kpi-body">
          <div className="app-shell-dashboard-kpi-header">
            <span className="app-shell-dashboard-kpi-title">{title}</span>
            <Badge emphasis="soft" tone="neutral">{badge}</Badge>
          </div>
          <div className="app-shell-dashboard-kpi-value-row">
            <span className="app-shell-dashboard-kpi-value">{value}</span>
            <Badge emphasis="soft" tone={resolveKpiBadgeTone(changePercentage)}>
              {formatChangePercentage(changePercentage)}
            </Badge>
          </div>
          <div aria-hidden="true" className="app-shell-dashboard-kpi-watermark">
            <Icon className="app-shell-dashboard-kpi-watermark-icon" />
          </div>
        </div>
      </Card>
    </div>
  );
}
