"use client";

import type { CSSProperties } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { STATISTICS_LINE_TRENDS_CHART_MARGIN } from "../data/statistics-line-trends.data";

export interface StatisticsTrendSeries {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

export interface StatisticsLineTrendsCardProps {
  readonly title: string;
  readonly series: readonly [StatisticsTrendSeries, StatisticsTrendSeries];
  readonly data: readonly Record<string, string | number>[];
}

export type StatisticsLineTrendsCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

const statisticsLineTrendsChartConfig = (
  series: StatisticsLineTrendsCardProps["series"]
) =>
  Object.fromEntries(
    series.map((item) => [item.key, { label: item.label, color: item.color }])
  ) satisfies Record<string, { readonly label: string; readonly color: string }>;

export function StatisticsLineTrendsCard({
  title,
  series,
  data,
}: StatisticsLineTrendsCardProps) {
  const chartConfig = statisticsLineTrendsChartConfig(series);
  const chartData = [...data];

  return (
    <article className="app-shell-statistics-trend-card">
      <Card>
        <div className="app-shell-statistics-trend-header">
          <span className="app-shell-statistics-trend-title">{title}</span>
        </div>
        <CardContent>
          <div className="app-shell-statistics-trend-layout">
            <div className="app-shell-statistics-trend-metrics">
              {series.map((item) => (
                <div className="app-shell-statistics-trend-metric" key={item.key}>
                  <div
                    className="app-shell-statistics-trend-swatch"
                    style={
                      { "--series-swatch-color": item.color } as CSSProperties
                    }
                  />
                  <div className="app-shell-statistics-trend-metric-copy">
                    <span className="app-shell-statistics-trend-metric-label">{item.label}</span>
                    <span className="app-shell-statistics-trend-metric-value">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              aria-label={`${title} line trend`}
              className="app-shell-statistics-trend-chart"
              role="img"
            >
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={STATISTICS_LINE_TRENDS_CHART_MARGIN}
                >
                  <CartesianGrid
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="time"
                    interval="preserveStartEnd"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    tickLine={false}
                    tickMargin={6}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={false}
                  />
                  {series.map((item) => (
                    <Line
                      activeDot={{ r: 3 }}
                      dataKey={item.key}
                      dot={false}
                      key={item.key}
                      stroke={item.color}
                      strokeWidth={2}
                      type="monotone"
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
