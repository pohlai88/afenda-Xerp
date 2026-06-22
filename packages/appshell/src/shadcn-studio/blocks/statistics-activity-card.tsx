"use client";

import { useId } from "react";
import { Area, AreaChart, XAxis } from "recharts";

import { Card, CardContent, ChartContainer, ChartTooltip, ChartTooltipContent } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_STATISTICS_METRIC_REPORT_CAPTION,
  formatStatisticsWeekdayTick,
  STATISTICS_METRIC_CHART_MARGIN,
  statisticsActivitySalesData,
} from "../data/statistics-component-10.data";

export type StatisticsActivityCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

const salesGrowthChartConfig = {
  sales: { label: "Sales" },
} satisfies Record<string, { readonly label: string }>;

function sanitizeSvgId(value: string): string {
  return value.replaceAll(/[^a-zA-Z0-9_-]/g, "");
}

export function StatisticsActivityCard() {
  const rawGradientId = useId();
  const gradientId = sanitizeSvgId(`app-shell-statistics-activity-${rawGradientId}`);
  const chartData = [...statisticsActivitySalesData];

  return (
    <article className="app-shell-statistics-metric-card">
      <Card>
        <CardContent>
          <div className="app-shell-statistics-metric-panel">
            <div className="app-shell-statistics-metric-copy">
              <div className="app-shell-statistics-metric-heading-stack">
                <span className="app-shell-statistics-metric-title">Activity</span>
                <span className="app-shell-statistics-metric-caption">
                  {DEFAULT_STATISTICS_METRIC_REPORT_CAPTION}
                </span>
              </div>
              <div className="app-shell-statistics-metric-value-stack">
                <span className="app-shell-statistics-metric-amount app-shell-statistics-metric-amount-hero">
                  82%
                </span>
                <span className="app-shell-statistics-metric-change">+38%</span>
              </div>
            </div>
            <div
              aria-label="Activity sales area trend"
              className="app-shell-statistics-metric-chart app-shell-statistics-metric-chart-area"
              role="img"
            >
              <ChartContainer config={salesGrowthChartConfig}>
                <AreaChart data={chartData} margin={STATISTICS_METRIC_CHART_MARGIN}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="10%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="90%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    dataKey="sales"
                    fill={`url(#${gradientId})`}
                    stroke="var(--primary)"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
