"use client";

import { useId } from "react";
import { Area, AreaChart } from "recharts";

import { Badge, Card, ChartContainer, ChartTooltip, ChartTooltipContent } from "@afenda/ui";
import type { GovernedBadgeProps, GovernedUiComponentName } from "@afenda/ui/governance";

import type {
  AppShellDashboardSparklineMetric,
  AppShellTrendDirection,
} from "../data/app-shell.dashboard.types";

export type AppShellDashboardSparklineStatGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Card" | "Chart"
>;

export interface AppShellDashboardSparklineStatProps
  extends AppShellDashboardSparklineMetric {
  readonly comparisonLabel: string;
}

function resolveSparklineBadgeTone(
  trend: AppShellTrendDirection
): NonNullable<GovernedBadgeProps["tone"]> {
  return trend === "up" ? "success" : "danger";
}

export function AppShellDashboardSparklineStat({
  metricKey,
  title,
  amount,
  changeLabel,
  comparisonLabel,
  trend,
  data,
}: AppShellDashboardSparklineStatProps) {
  const gradientId = useId();
  const chartConfig = {
    [metricKey]: { label: title },
  } satisfies Record<string, { readonly label: string }>;

  return (
    <div className="app-shell-dashboard-widget">
      <Card>
        <div className="app-shell-dashboard-sparkline-body">
          <div className="app-shell-dashboard-sparkline-copy">
            <div className="app-shell-dashboard-sparkline-meta">
              <span className="app-shell-dashboard-sparkline-label">{title}</span>
              <span className="app-shell-dashboard-sparkline-amount">{amount}</span>
            </div>
            <div className="app-shell-dashboard-sparkline-change-row">
              <Badge emphasis="soft" tone={resolveSparklineBadgeTone(trend)}>
                {changeLabel}
              </Badge>
              <span className="app-shell-dashboard-sparkline-comparison">
                {comparisonLabel}
              </span>
            </div>
          </div>
          <div className="app-shell-dashboard-sparkline-chart-frame">
            <ChartContainer config={chartConfig}>
              <AreaChart data={[...data]} margin={{ left: 4, right: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="10%" stopColor="var(--primary)" stopOpacity={1} />
                    <stop offset="90%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Area
                  dataKey="value"
                  fill={`url(#${gradientId})`}
                  stackId="a"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  type="natural"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}
