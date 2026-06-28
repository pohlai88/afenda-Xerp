"use client";

import {
  Card,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId, useMemo } from "react";
import {
  LazyArea as Area,
  LazyAreaChart as AreaChart,
} from "../../../charts/recharts-lazy.client";
import { TrendIndicator } from "../../blocks/app-shell-dashboard-breakdown.utils";
import { APP_SHELL_DASHBOARD_SPARKLINE_CHART_MARGIN } from "../../data/app-shell.dashboard.data";
import type {
  AppShellDashboardSparklineMetric,
  AppShellDashboardSparklinePoint,
} from "../../data/app-shell.dashboard.types";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type AppShellDashboardSparklineStatGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

export interface AppShellDashboardSparklineStatProps
  extends AppShellDashboardSparklineMetric {
  readonly comparisonLabel: string;
}

export interface SparklineSeriesSummary {
  readonly latestDate: string;
  readonly latestValue: number;
  readonly peakDate: string;
  readonly peakValue: number;
  readonly pointCount: number;
  readonly windowDelta: number;
}

function sanitizeSvgId(value: string): string {
  return value.replaceAll(/[^a-zA-Z0-9_-]/g, "");
}

export function formatSparklineCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatSparklineDateLabel(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export function buildSparklineSeriesSummary(
  data: readonly AppShellDashboardSparklinePoint[]
): SparklineSeriesSummary | null {
  if (data.length === 0) {
    return null;
  }

  let peakValue = data[0]?.value ?? 0;
  let peakDate = data[0]?.date ?? "";
  let latestValue = data[0]?.value ?? 0;
  let latestDate = data[0]?.date ?? "";

  for (const point of data) {
    if (point.value >= peakValue) {
      peakValue = point.value;
      peakDate = point.date;
    }

    latestValue = point.value;
    latestDate = point.date;
  }

  const firstValue = data[0]?.value ?? 0;
  const windowDelta = latestValue - firstValue;

  return {
    latestDate,
    latestValue,
    peakDate,
    peakValue,
    pointCount: data.length,
    windowDelta,
  };
}

function resolveSparklineInsights(
  summary: SparklineSeriesSummary | null
): string | null {
  if (summary === null) {
    return null;
  }

  const pointsLabel =
    summary.pointCount === 1 ? "1 point" : `${summary.pointCount} points`;
  const peakLabel = `peak ${formatSparklineCurrency(summary.peakValue)} on ${formatSparklineDateLabel(summary.peakDate)}`;

  return `${pointsLabel} · ${peakLabel}`;
}

function resolveSparklineChartFrameClass(
  metricKey: AppShellDashboardSparklineMetric["metricKey"]
): string {
  return metricKey === "expense"
    ? "app-shell-studio-sparkline__chart-frame app-shell-studio-sparkline__chart-frame--expense"
    : "app-shell-studio-sparkline__chart-frame app-shell-studio-sparkline__chart-frame--revenue";
}

function GovernedAppShellDashboardSparklineStat({
  id,
  metricKey,
  title,
  amount,
  changeLabel,
  comparisonLabel,
  trend,
  data,
}: AppShellDashboardSparklineStatProps) {
  const titleId = useId();
  const footnoteId = useId();
  const rawGradientId = useId();
  const gradientId = sanitizeSvgId(
    `app-shell-sparkline-${metricKey}-${id}-${rawGradientId}`
  );
  const summary = useMemo(() => buildSparklineSeriesSummary(data), [data]);
  const chartData = useMemo(() => [...data], [data]);
  const insights = resolveSparklineInsights(summary);
  const chartLabel =
    summary === null
      ? `${title} sparkline with no data`
      : `${title} sparkline from ${formatSparklineDateLabel(data[0]?.date ?? summary.latestDate)} to ${formatSparklineDateLabel(data.at(-1)?.date ?? summary.latestDate)}`;

  const chartConfig = {
    value: { label: title },
  } satisfies Record<string, { readonly label: string }>;

  return (
    <article
      aria-labelledby={titleId}
      className="app-shell-dashboard-widget app-shell-studio-sparkline-card"
    >
      <Card>
        <div className="app-shell-studio-sparkline__body">
          <div className="app-shell-studio-sparkline__copy">
            <div className="app-shell-studio-sparkline__meta">
              <span className="app-shell-studio-sparkline__label" id={titleId}>
                {title}
              </span>
              <span
                aria-describedby={footnoteId}
                className="app-shell-studio-sparkline__amount"
              >
                {amount}
              </span>
            </div>

            <div
              className="app-shell-studio-sparkline__change-row"
              id={footnoteId}
            >
              <span className="app-shell-studio-sparkline__change">
                {changeLabel}
              </span>
              <span className="app-shell-studio-sparkline__trend">
                <TrendIndicator trend={trend} />
              </span>
              <span className="app-shell-studio-sparkline__comparison">
                {comparisonLabel}
              </span>
            </div>

            {insights === null ? (
              <span className="app-shell-studio-sparkline__insights">
                No trend data available
              </span>
            ) : (
              <span className="app-shell-studio-sparkline__insights">
                {insights}
              </span>
            )}
          </div>

          <div
            aria-label={chartLabel}
            className={resolveSparklineChartFrameClass(metricKey)}
            role="img"
          >
            {chartData.length === 0 ? (
              <div className="app-shell-studio-sparkline__empty-chart">
                Awaiting metric points
              </div>
            ) : (
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  aria-hidden="true"
                  data={chartData}
                  margin={APP_SHELL_DASHBOARD_SPARKLINE_CHART_MARGIN}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="10%"
                        stopColor="var(--sparkline-stroke, var(--primary))"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="90%"
                        stopColor="var(--sparkline-stroke, var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          formatSparklineCurrency(Number(value))
                        }
                        hideLabel={false}
                        labelFormatter={(label) =>
                          formatSparklineDateLabel(String(label))
                        }
                      />
                    }
                    cursor={false}
                  />
                  <Area
                    dataKey="value"
                    fill={`url(#${gradientId})`}
                    stroke="var(--sparkline-stroke, var(--primary))"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}

export const AppShellDashboardSparklineStat = createPresentationMcpWrapper({
  status: "governed-compose",
  GovernedComponent: GovernedAppShellDashboardSparklineStat,
});
