import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_STATISTICS_LINE_TRENDS_LABEL,
  defaultStatisticsLineTrendsCards,
} from "../data/statistics-line-trends.data";
import {
  StatisticsLineTrendsCard,
  type StatisticsLineTrendsCardProps,
} from "./statistics-line-trends-card";

export type AppShellDashboardStatisticsLineTrendsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

export interface AppShellDashboardStatisticsLineTrendsProps {
  readonly cards?: readonly StatisticsLineTrendsCardProps[];
  readonly sectionLabel?: string;
}

export function AppShellDashboardStatisticsLineTrends({
  sectionLabel = DEFAULT_STATISTICS_LINE_TRENDS_LABEL,
  cards = defaultStatisticsLineTrendsCards,
}: AppShellDashboardStatisticsLineTrendsProps = {}) {
  return (
    <section
      aria-label={sectionLabel}
      className="app-shell-dashboard-statistics-line-trends"
    >
      <div className="app-shell-statistics-trend-grid">
        {cards.map((card) => (
          <StatisticsLineTrendsCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
