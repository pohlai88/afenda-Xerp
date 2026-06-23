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
import {
  LazyBar as Bar,
  LazyBarChart as BarChart,
  LazyCell as Cell,
  LazyXAxis as XAxis,
} from "../../charts/recharts-lazy.client";

import {
  DEFAULT_STATISTICS_METRIC_REPORT_CAPTION,
  formatStatisticsWeekdayTick,
  STATISTICS_METRIC_CHART_MARGIN,
  STATISTICS_REVENUE_CHART_ARIA_LABEL,
  STATISTICS_REVENUE_HIGHLIGHT_DAY,
  statisticsRevenueBarData,
} from "../data/statistics-component-10.data";

export type StatisticsRevenueCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

const revenueChartConfig = {
  revenue: { label: "Revenue" },
} satisfies Record<string, { readonly label: string }>;

function resolveRevenueBarFill(day: string): string {
  return day === STATISTICS_REVENUE_HIGHLIGHT_DAY
    ? "var(--primary)"
    : "color-mix(in oklab, var(--primary) 20%, transparent)";
}

export function StatisticsRevenueCard() {
  const titleId = useId();
  const footnoteId = useId();
  const chartData = [...statisticsRevenueBarData];

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
                  Revenue growth
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
                  $3,234
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
              aria-label={STATISTICS_REVENUE_CHART_ARIA_LABEL}
              className="app-shell-statistics-metric-chart app-shell-statistics-metric-chart-bars"
              role="img"
            >
              <ChartContainer config={revenueChartConfig}>
                <BarChart
                  accessibilityLayer
                  aria-hidden="true"
                  barSize={10}
                  data={chartData}
                  margin={STATISTICS_METRIC_CHART_MARGIN}
                >
                  <XAxis
                    axisLine={false}
                    dataKey="day"
                    interval={0}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    tickFormatter={formatStatisticsWeekdayTick}
                    tickLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={false}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell
                        fill={resolveRevenueBarFill(entry.day)}
                        key={entry.day}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
