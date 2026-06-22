import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { DEFAULT_STATISTICS_COMPONENT_10_LABEL } from "../data/statistics-component-10.data";
import { StatisticsActivityCard } from "./statistics-activity-card";
import { StatisticsLeadsCard } from "./statistics-leads-card";
import { StatisticsProfileTrafficCard } from "./statistics-profile-traffic-card";
import { StatisticsRevenueCard } from "./statistics-revenue-card";

export type AppShellDashboardStatisticsMetricsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

export function AppShellDashboardStatisticsMetrics() {
  return (
    <section
      aria-label={DEFAULT_STATISTICS_COMPONENT_10_LABEL}
      className="app-shell-dashboard-statistics-metrics"
    >
      <div className="app-shell-statistics-metric-grid">
        <StatisticsRevenueCard />
        <StatisticsLeadsCard />
        <StatisticsActivityCard />
        <StatisticsProfileTrafficCard />
      </div>
    </section>
  );
}
