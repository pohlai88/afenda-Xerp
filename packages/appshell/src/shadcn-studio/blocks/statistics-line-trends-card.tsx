"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

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
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="app-shell-statistics-trend-metric-copy">
                    <p className="app-shell-statistics-trend-metric-label">{item.label}</p>
                    <p className="app-shell-statistics-trend-metric-value">
                      {item.value.toLocaleString()}
                    </p>
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
                  data={chartData}
                  margin={{ bottom: 0, left: 0, right: 0, top: 4 }}
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
                      stroke={`var(--color-${item.key})`}
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
