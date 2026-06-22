"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, ChartContainer, ChartTooltip, ChartTooltipContent } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_STATISTICS_METRIC_REPORT_CAPTION,
  formatStatisticsMonthTick,
  STATISTICS_METRIC_CHART_MARGIN,
  statisticsLeadChartData,
} from "../data/statistics-component-10.data";

export type StatisticsLeadsCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

const leadChartConfig = {
  sales: { label: "Leads" },
  january: {
    label: "January",
    color: "color-mix(in oklab, var(--primary) 60%, transparent)",
  },
  february: {
    label: "February",
    color: "var(--primary)",
  },
  march: {
    label: "March",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
} satisfies Record<string, { readonly label: string; readonly color?: string }>;

type LeadChartMonth = keyof typeof leadChartConfig;

function resolveLeadBarFill(month: string): string {
  const config = leadChartConfig[month as LeadChartMonth];
  return config && "color" in config && config.color !== undefined
    ? config.color
    : "var(--primary)";
}

export function StatisticsLeadsCard() {
  const chartData = [...statisticsLeadChartData];

  return (
    <article className="app-shell-statistics-metric-card">
      <Card>
        <CardContent>
          <div className="app-shell-statistics-metric-panel">
            <div className="app-shell-statistics-metric-copy">
              <div className="app-shell-statistics-metric-heading-stack">
                <span className="app-shell-statistics-metric-title">Generated leads</span>
                <span className="app-shell-statistics-metric-caption">
                  {DEFAULT_STATISTICS_METRIC_REPORT_CAPTION}
                </span>
              </div>
              <div className="app-shell-statistics-metric-value-stack">
                <span className="app-shell-statistics-metric-amount">4,350</span>
                <span className="app-shell-statistics-metric-change">+18.2%</span>
              </div>
            </div>
            <div
              aria-label="Generated leads horizontal bar chart"
              className="app-shell-statistics-metric-chart app-shell-statistics-metric-chart-bars-horizontal"
              role="img"
            >
              <ChartContainer config={leadChartConfig}>
                <BarChart
                  accessibilityLayer
                  barSize={10}
                  data={chartData}
                  layout="vertical"
                  margin={STATISTICS_METRIC_CHART_MARGIN}
                >
                  <XAxis hide type="number" />
                  <YAxis
                    axisLine={false}
                    dataKey="month"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    tickFormatter={formatStatisticsMonthTick}
                    tickLine={false}
                    type="category"
                    width={44}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={false}
                  />
                  <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry) => (
                      <Cell fill={resolveLeadBarFill(entry.month)} key={entry.month} />
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
