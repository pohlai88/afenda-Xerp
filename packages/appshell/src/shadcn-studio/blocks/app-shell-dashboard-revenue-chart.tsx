"use client";

import type { ReactNode } from "react";
import { CircleDollarSignIcon, WalletIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label as RechartsLabel,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Avatar,
  AvatarFallback,
  Card,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_CAPTION,
  DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_LABEL,
  DEFAULT_APP_SHELL_DASHBOARD_REVENUE_TITLE,
  defaultAppShellDashboardRevenueBars,
  defaultAppShellDashboardRevenueGrowthSlices,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardRevenueBarPoint,
  AppShellDashboardRevenueGrowthSlice,
} from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardRevenueChartGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Card" | "Chart" | "Select"
>;

export interface AppShellDashboardRevenueChartProps {
  readonly title?: string;
  readonly growthLabel?: string;
  readonly growthCaption?: string;
  readonly overflowItems?: readonly string[];
  readonly barData?: readonly AppShellDashboardRevenueBarPoint[];
  readonly growthData?: readonly AppShellDashboardRevenueGrowthSlice[];
}

const revenueBarChartConfig = {
  currentYear: {
    label: "FY2026",
    color: "var(--primary)",
  },
  priorYear: {
    label: "FY2025",
    color: "color-mix(in oklab, var(--primary) 20%, var(--background))",
  },
} satisfies Record<
  string,
  { readonly label: string; readonly color: string }
>;

const revenueGrowthChartConfig = {
  revenue: { label: "Revenue" },
} satisfies Record<string, { readonly label: string }>;

const revenueYearSummaries = [
  {
    icon: <CircleDollarSignIcon aria-hidden className="app-shell-dashboard-revenue-icon" />,
    year: "FY2026",
    amount: "$248.7K",
  },
  {
    icon: <WalletIcon aria-hidden className="app-shell-dashboard-revenue-icon" />,
    year: "FY2025",
    amount: "$212.4K",
  },
] as const satisfies readonly {
  readonly icon: ReactNode;
  readonly year: string;
  readonly amount: string;
}[];

export function AppShellDashboardRevenueChart({
  title = DEFAULT_APP_SHELL_DASHBOARD_REVENUE_TITLE,
  growthLabel = DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_LABEL,
  growthCaption = DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_CAPTION,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  barData = defaultAppShellDashboardRevenueBars,
  growthData = defaultAppShellDashboardRevenueGrowthSlices,
}: AppShellDashboardRevenueChartProps) {
  return (
    <div className="app-shell-dashboard-widget app-shell-dashboard-revenue-widget">
      <Card>
        <div className="app-shell-dashboard-revenue-layout">
          <div className="app-shell-dashboard-revenue-primary">
            <div className="app-shell-dashboard-widget-header">
              <span className="app-shell-dashboard-widget-title">{title}</span>
              <AppShellDashboardOverflowMenu items={overflowItems} />
            </div>
            <div className="app-shell-dashboard-revenue-bar-frame">
              <ChartContainer config={revenueBarChartConfig}>
                <BarChart
                  barSize={12}
                  data={[...barData]}
                  margin={{ left: -25 }}
                  stackOffset="sign"
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="6" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="name"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 14 }}
                    tickFormatter={(value: string) => value.slice(0, 3)}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    axisLine={false}
                    domain={[-20, 30]}
                    tick={{ fill: "var(--muted-foreground)" }}
                    tickFormatter={(value: number) => String(value)}
                    tickLine={false}
                    tickMargin={8}
                    ticks={[-20, -10, 0, 10, 20, 30]}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                  <Bar
                    dataKey="currentYear"
                    fill="var(--color-currentYear)"
                    radius={[12, 12, 0, 0]}
                    stackId="stack"
                  />
                  <Bar
                    dataKey="priorYear"
                    fill="var(--color-priorYear)"
                    radius={[12, 12, 0, 0]}
                    stackId="stack"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          <div className="app-shell-dashboard-revenue-secondary">
            <div className="app-shell-dashboard-revenue-select-row">
              <Select defaultValue="revenue">
                <SelectTrigger>
                  <SelectValue placeholder="Report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                    <SelectItem value="profit">Profit</SelectItem>
                    <SelectItem value="net-income">Net income</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="app-shell-dashboard-revenue-growth-panel">
              <div className="app-shell-dashboard-revenue-growth-chart-frame">
                <ChartContainer config={revenueGrowthChartConfig}>
                  <PieChart margin={{ bottom: -20, top: 0 }}>
                    <Pie
                      data={[...growthData]}
                      dataKey="revenue"
                      endAngle={220}
                      innerRadius={60}
                      nameKey="date"
                      outerRadius={85}
                      paddingAngle={5}
                      startAngle={0}
                    >
                      <RechartsLabel
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
                                  className="app-shell-dashboard-revenue-growth-value"
                                  x={viewBox.cx}
                                  y={(viewBox.cy ?? 0) + 3}
                                >
                                  {growthLabel}
                                </tspan>
                                <tspan
                                  className="app-shell-dashboard-revenue-growth-caption"
                                  x={viewBox.cx}
                                  y={(viewBox.cy ?? 0) + 24}
                                >
                                  Growth
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
              <span className="app-shell-dashboard-revenue-growth-footnote">
                {growthCaption}
              </span>
            </div>

            <div className="app-shell-dashboard-revenue-summary-row">
              {revenueYearSummaries.map((summary) => (
                <div className="app-shell-dashboard-revenue-summary-item" key={summary.year}>
                  <Avatar>
                    <AvatarFallback>{summary.icon}</AvatarFallback>
                  </Avatar>
                  <div className="app-shell-dashboard-revenue-summary-copy">
                    <span className="app-shell-dashboard-revenue-summary-year">
                      {summary.year}
                    </span>
                    <span className="app-shell-dashboard-revenue-summary-amount">
                      {summary.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
