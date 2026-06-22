"use client";

import { Bar, BarChart, Cell, XAxis } from "recharts";

import { Card, CardContent, ChartContainer, ChartTooltip, ChartTooltipContent } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_STATISTICS_METRIC_REPORT_CAPTION,
  formatStatisticsWeekdayTick,
  STATISTICS_METRIC_CHART_MARGIN,
  statisticsRevenueBarData,
} from "../data/statistics-component-10.data";

export type StatisticsRevenueCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

const revenueChartConfig = {
  revenue: { label: "Revenue" },
} satisfies Record<string, { readonly label: string }>;

export function StatisticsRevenueCard() {
  const chartData = [...statisticsRevenueBarData];

  return (
    <article className="app-shell-statistics-metric-card">
      <Card>
        <CardContent>
          <div className="app-shell-statistics-metric-panel">
            <div className="app-shell-statistics-metric-copy">
              <div className="app-shell-statistics-metric-heading-stack">
                <span className="app-shell-statistics-metric-title">Revenue growth</span>
                <span className="app-shell-statistics-metric-caption">
                  {DEFAULT_STATISTICS_METRIC_REPORT_CAPTION}
                </span>
              </div>
              <div className="app-shell-statistics-metric-value-stack">
                <span className="app-shell-statistics-metric-amount">$3,234</span>
                <span className="app-shell-statistics-metric-change">+15%</span>
              </div>
            </div>
            <div
              aria-label="Revenue growth bar chart"
              className="app-shell-statistics-metric-chart app-shell-statistics-metric-chart-bars"
              role="img"
            >
              <ChartContainer config={revenueChartConfig}>
                <BarChart
                  accessibilityLayer
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
                        fill={
                          "fill" in entry && entry.fill !== undefined
                            ? entry.fill
                            : "var(--primary)"
                        }
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
