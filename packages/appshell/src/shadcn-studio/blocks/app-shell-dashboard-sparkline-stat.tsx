"use client";

import { useId, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Area, AreaChart } from "recharts";

import { Card, ChartContainer, ChartTooltip, ChartTooltipContent } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import type {
  AppShellDashboardSparklineMetric,
  AppShellDashboardSparklinePoint,
  AppShellTrendDirection,
} from "../data/app-shell.dashboard.types";

export type AppShellDashboardSparklineStatGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart"
>;

export interface AppShellDashboardSparklineStatProps
  extends AppShellDashboardSparklineMetric {
  readonly comparisonLabel: string;
}

export interface SparklineSeriesSummary {
  readonly pointCount: number;
  readonly peakValue: number;
  readonly peakDate: string;
  readonly latestValue: number;
  readonly latestDate: string;
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

function resolveSparklineInsights(summary: SparklineSeriesSummary | null): string | null {
  if (summary === null) {
    return null;
  }

  const pointsLabel = summary.pointCount === 1 ? "1 point" : `${summary.pointCount} points`;
  const peakLabel = `peak ${formatSparklineCurrency(summary.peakValue)} on ${formatSparklineDateLabel(summary.peakDate)}`;

  return `${pointsLabel} · ${peakLabel}`;
}

function resolveSparklineChartFrameClass(
  metricKey: AppShellDashboardSparklineMetric["metricKey"]
): string {
  return metricKey === "expense"
    ? "app-shell-dashboard-sparkline-chart-frame app-shell-dashboard-sparkline-chart-frame-expense"
    : "app-shell-dashboard-sparkline-chart-frame app-shell-dashboard-sparkline-chart-frame-revenue";
}

function TrendIndicator({ trend }: { readonly trend: AppShellTrendDirection }) {
  return trend === "up" ? (
    <ChevronUpIcon aria-hidden className="app-shell-dashboard-trend-icon-up" />
  ) : (
    <ChevronDownIcon aria-hidden className="app-shell-dashboard-trend-icon-down" />
  );
}

export function AppShellDashboardSparklineStat({
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
  const rawGradientId = useId();
  const gradientId = sanitizeSvgId(`app-shell-sparkline-${metricKey}-${id}-${rawGradientId}`);
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
      className="app-shell-dashboard-widget app-shell-dashboard-sparkline-widget"
    >
      <Card>
        <div className="app-shell-dashboard-sparkline-body">
          <div className="app-shell-dashboard-sparkline-copy">
            <div className="app-shell-dashboard-sparkline-meta">
              <span className="app-shell-dashboard-sparkline-label" id={titleId}>
                {title}
              </span>
              <p className="app-shell-dashboard-sparkline-amount">{amount}</p>
            </div>

            <div className="app-shell-dashboard-sparkline-change-row">
              <span className="app-shell-dashboard-sparkline-change">{changeLabel}</span>
              <span className="app-shell-dashboard-sparkline-trend">
                <TrendIndicator trend={trend} />
                <span className="sr-only">
                  {trend === "up" ? "Trending up" : "Trending down"}
                </span>
              </span>
              <span className="app-shell-dashboard-sparkline-comparison">
                {comparisonLabel}
              </span>
            </div>

            {insights === null ? (
              <span className="app-shell-dashboard-sparkline-insights">
                No trend data available
              </span>
            ) : (
              <span className="app-shell-dashboard-sparkline-insights">{insights}</span>
            )}
          </div>

          <div
            aria-label={chartLabel}
            className={resolveSparklineChartFrameClass(metricKey)}
            role="img"
          >
            {chartData.length === 0 ? (
              <div className="app-shell-dashboard-sparkline-empty-chart">
                Awaiting metric points
              </div>
            ) : (
              <ChartContainer config={chartConfig}>
                <AreaChart data={chartData} margin={{ bottom: 0, left: 4, right: 0, top: 4 }}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="10%"
                        stopColor="var(--sparkline-stroke, var(--primary))"
                        stopOpacity={1}
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
                        formatter={(value) => formatSparklineCurrency(Number(value))}
                        hideLabel={false}
                        labelFormatter={(label) => formatSparklineDateLabel(String(label))}
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
