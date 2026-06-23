"use client";

import {
  Card,
  CardContent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId } from "react";
import { Bar, BarChart } from "recharts";

import {
  DEFAULT_STATISTICS_METRIC_REPORT_CAPTION,
  STATISTICS_METRIC_CHART_MARGIN,
  STATISTICS_PROFILE_TRAFFIC_CHART_ARIA_LABEL,
  statisticsProfileTrafficData,
} from "../data/statistics-component-10.data";

export type StatisticsProfileTrafficCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

const profileTrafficChartConfig = {
  traffic: { label: "Traffic" },
} satisfies Record<string, { readonly label: string }>;

export function StatisticsProfileTrafficCard() {
  const titleId = useId();
  const footnoteId = useId();
  const chartData = [...statisticsProfileTrafficData];

  return (
    <article
      aria-labelledby={titleId}
      className="app-shell-statistics-metric-card"
    >
      <Card>
        <CardContent>
          <div className="app-shell-statistics-metric-panel">
            <div className="app-shell-statistics-metric-copy">
              <div className="app-shell-statistics-metric-heading-stack">
                <span
                  className="app-shell-statistics-metric-title"
                  id={titleId}
                >
                  Average profile traffic
                </span>
                <span className="app-shell-statistics-metric-caption">
                  {DEFAULT_STATISTICS_METRIC_REPORT_CAPTION}
                </span>
              </div>
              <div className="app-shell-statistics-metric-value-stack">
                <span
                  aria-describedby={footnoteId}
                  className="app-shell-statistics-metric-amount"
                >
                  2.84k
                </span>
                <span
                  className="app-shell-statistics-metric-change"
                  id={footnoteId}
                >
                  +15%
                </span>
              </div>
            </div>
            <div
              aria-label={STATISTICS_PROFILE_TRAFFIC_CHART_ARIA_LABEL}
              className="app-shell-statistics-metric-chart app-shell-statistics-metric-chart-bars"
              role="img"
            >
              <ChartContainer config={profileTrafficChartConfig}>
                <BarChart
                  accessibilityLayer
                  barSize={10}
                  data={chartData}
                  margin={STATISTICS_METRIC_CHART_MARGIN}
                >
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={false}
                  />
                  <Bar
                    dataKey="traffic"
                    fill="var(--primary)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
