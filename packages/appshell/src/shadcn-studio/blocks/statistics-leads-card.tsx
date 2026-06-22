"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, ChartContainer, ChartTooltip, ChartTooltipContent } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_STATISTICS_METRIC_REPORT_CAPTION,
  statisticsLeadChartData,
  STATISTICS_LEAD_CENTER_LABEL,
} from "../data/statistics-component-10.data";

export type StatisticsLeadsCardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

const leadChartConfig = {
  sales: { label: "Sales" },
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
              aria-label="Generated leads donut chart"
              className="app-shell-statistics-metric-chart app-shell-statistics-metric-chart-donut"
              role="img"
            >
              <ChartContainer config={leadChartConfig}>
                <PieChart margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={false}
                  />
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={chartData}
                    dataKey="sales"
                    innerRadius="58%"
                    nameKey="month"
                    outerRadius="78%"
                    paddingAngle={2}
                    strokeWidth={1}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              dominantBaseline="middle"
                              textAnchor="middle"
                              x={viewBox.cx}
                              y={viewBox.cy}
                            >
                              <tspan
                                fill="var(--foreground)"
                                fontSize="14"
                                fontWeight="600"
                                x={viewBox.cx}
                                y={viewBox.cy}
                              >
                                {STATISTICS_LEAD_CENTER_LABEL}
                              </tspan>
                            </text>
                          );
                        }

                        return null;
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
