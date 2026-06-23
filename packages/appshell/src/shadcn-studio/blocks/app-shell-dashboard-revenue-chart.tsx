"use client";

import {
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
  Separator,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId, useMemo } from "react";
import {
  LazyBar as Bar,
  LazyBarChart as BarChart,
  LazyCartesianGrid as CartesianGrid,
  LazyCell as Cell,
  LazyXAxis as XAxis,
  LazyYAxis as YAxis,
} from "../../charts/recharts-lazy.client";

import {
  DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  DEFAULT_APP_SHELL_DASHBOARD_REVENUE_COMPARISON,
  DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_CAPTION,
  DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_LABEL,
  DEFAULT_APP_SHELL_DASHBOARD_REVENUE_SUBTITLE,
  DEFAULT_APP_SHELL_DASHBOARD_REVENUE_TITLE,
  defaultAppShellDashboardRevenueBars,
  defaultAppShellDashboardRevenueGrowthSlices,
  defaultAppShellDashboardRevenueYearSummaries,
} from "../data/app-shell.dashboard.data";
import type {
  AppShellDashboardOverflowMenuItem,
  AppShellDashboardRevenueBarPoint,
  AppShellDashboardRevenueGrowthSlice,
  AppShellDashboardRevenueYearSummary,
} from "../data/app-shell.dashboard.types";
import { AppShellDashboardOverflowMenu } from "./app-shell-dashboard-overflow-menu";

export type AppShellDashboardRevenueChartGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card" | "Chart" | "Select" | "Separator"
>;

export interface AppShellDashboardRevenueChartProps {
  readonly barData?: readonly AppShellDashboardRevenueBarPoint[];
  readonly comparisonText?: string;
  readonly growthCaption?: string;
  readonly growthData?: readonly AppShellDashboardRevenueGrowthSlice[];
  readonly growthLabel?: string;
  readonly overflowItems?: readonly AppShellDashboardOverflowMenuItem[];
  readonly subtitle?: string;
  readonly title?: string;
  readonly yearSummaries?: readonly AppShellDashboardRevenueYearSummary[];
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
} satisfies Record<string, { readonly label: string; readonly color: string }>;

const revenueGrowthChartConfig = {
  revenue: {
    label: "Revenue mix",
    color: "var(--chart-1)",
  },
} satisfies Record<string, { readonly label: string; readonly color: string }>;

const REPORT_OPTIONS = [
  { value: "revenue", label: "Revenue" },
  { value: "expenses", label: "Expenses" },
  { value: "profit", label: "Profit" },
  { value: "net-income", label: "Net income" },
] as const satisfies readonly {
  readonly label: string;
  readonly value: string;
}[];

function computeSignedBarDomain(
  data: readonly AppShellDashboardRevenueBarPoint[]
): readonly [number, number] {
  let minValue = 0;
  let maxValue = 0;

  for (const point of data) {
    minValue = Math.min(minValue, point.priorYear);
    maxValue = Math.max(maxValue, point.currentYear);
  }

  const step = 10;
  const min = Math.floor(minValue / step) * step - step;
  const max = Math.ceil(maxValue / step) * step + step;

  return [min, max];
}

function parseCompactCurrency(value: string): number {
  const normalized = value.replace("$", "").trim();

  if (normalized.endsWith("K")) {
    return Number.parseFloat(normalized.slice(0, -1)) * 1000;
  }

  if (normalized.endsWith("M")) {
    return Number.parseFloat(normalized.slice(0, -1)) * 1_000_000;
  }

  return Number.parseFloat(normalized.replaceAll(",", ""));
}

function computePrimaryYearAmount(
  summaries: readonly AppShellDashboardRevenueYearSummary[]
): string {
  const currentYear =
    summaries.find((summary) => summary.year.startsWith("FY2026")) ??
    summaries[0];

  return currentYear?.amount ?? "$0";
}

function computeYearOverYearChange(
  summaries: readonly AppShellDashboardRevenueYearSummary[]
): string {
  const sorted = [...summaries].sort((left, right) =>
    right.year.localeCompare(left.year)
  );

  if (sorted.length < 2) {
    return "+0%";
  }

  const currentSummary = sorted[0];
  const priorSummary = sorted[1];

  if (currentSummary === undefined || priorSummary === undefined) {
    return "+0%";
  }

  const current = parseCompactCurrency(currentSummary.amount);
  const prior = parseCompactCurrency(priorSummary.amount);

  if (prior <= 0) {
    return "+0%";
  }

  const change = ((current - prior) / prior) * 100;
  const prefix = change > 0 ? "+" : "";

  return `${prefix}${change.toFixed(1)}%`;
}

function buildYAxisTicks(min: number, max: number): readonly number[] {
  const ticks: number[] = [];

  for (let value = min; value <= max; value += 10) {
    ticks.push(value);
  }

  return ticks;
}

export function buildRevenueBarChartLabel(
  barData: readonly AppShellDashboardRevenueBarPoint[]
): string {
  if (barData.length === 0) {
    return "Monthly revenue variance chart with no data";
  }

  const months = barData.map((point) => point.name).join(", ");
  return `Monthly revenue variance comparing FY2026 and FY2025 for ${months}`;
}

function formatGrowthDateTick(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function RevenueYearSummaryItem({
  summary,
}: {
  readonly summary: AppShellDashboardRevenueYearSummary;
}) {
  return (
    <div className="app-shell-dashboard-revenue-summary-item">
      <div className="app-shell-dashboard-revenue-icon-frame">
        <summary.Icon
          aria-hidden
          className="app-shell-dashboard-revenue-icon"
        />
      </div>
      <div className="app-shell-dashboard-revenue-summary-copy">
        <span className="app-shell-dashboard-revenue-summary-year">
          {summary.year}
        </span>
        <span className="app-shell-dashboard-revenue-summary-amount">
          {summary.amount}
        </span>
      </div>
    </div>
  );
}

export function AppShellDashboardRevenueChart({
  title = DEFAULT_APP_SHELL_DASHBOARD_REVENUE_TITLE,
  subtitle = DEFAULT_APP_SHELL_DASHBOARD_REVENUE_SUBTITLE,
  comparisonText = DEFAULT_APP_SHELL_DASHBOARD_REVENUE_COMPARISON,
  growthLabel = DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_LABEL,
  growthCaption = DEFAULT_APP_SHELL_DASHBOARD_REVENUE_GROWTH_CAPTION,
  overflowItems = DEFAULT_APP_SHELL_DASHBOARD_OVERFLOW_ITEMS,
  barData = defaultAppShellDashboardRevenueBars,
  growthData = defaultAppShellDashboardRevenueGrowthSlices,
  yearSummaries = defaultAppShellDashboardRevenueYearSummaries,
}: AppShellDashboardRevenueChartProps) {
  const primarySectionId = useId();
  const growthSectionId = useId();
  const reportSelectId = useId();
  const [yMin, yMax] = useMemo(
    () => computeSignedBarDomain(barData),
    [barData]
  );
  const yAxisTicks = useMemo(() => buildYAxisTicks(yMin, yMax), [yMin, yMax]);
  const primaryYearAmount = useMemo(
    () => computePrimaryYearAmount(yearSummaries),
    [yearSummaries]
  );
  const yearOverYearChange = useMemo(
    () => computeYearOverYearChange(yearSummaries),
    [yearSummaries]
  );
  const barChartLabel = useMemo(
    () => buildRevenueBarChartLabel(barData),
    [barData]
  );

  return (
    <article
      aria-labelledby={primarySectionId}
      className="app-shell-dashboard-widget app-shell-dashboard-revenue-widget"
    >
      <Card>
        <div className="app-shell-dashboard-revenue-layout">
          <section className="app-shell-dashboard-revenue-primary">
            <div className="app-shell-dashboard-widget-header app-shell-dashboard-widget-header-stacked">
              <div className="app-shell-dashboard-widget-heading">
                <h2
                  className="app-shell-dashboard-widget-title"
                  id={primarySectionId}
                >
                  {title}
                </h2>
                <p className="app-shell-dashboard-widget-subtitle">
                  {subtitle}
                </p>
              </div>
              <AppShellDashboardOverflowMenu
                items={overflowItems}
                menuLabel="Revenue chart actions"
              />
            </div>

            <div className="app-shell-dashboard-revenue-primary-body">
              <div className="app-shell-dashboard-revenue-hero">
                <div className="app-shell-dashboard-revenue-hero-row">
                  <span className="app-shell-dashboard-revenue-hero-amount">
                    {primaryYearAmount}
                  </span>
                  <span className="app-shell-dashboard-revenue-yoy-change">
                    {yearOverYearChange} YoY
                  </span>
                </div>
                <span className="app-shell-dashboard-revenue-comparison">
                  {comparisonText}
                </span>
              </div>

              <div
                aria-hidden="true"
                className="app-shell-dashboard-revenue-legend"
              >
                <span className="app-shell-dashboard-revenue-legend-item">
                  <span className="app-shell-dashboard-revenue-legend-swatch app-shell-dashboard-revenue-legend-swatch-current" />
                  FY2026
                </span>
                <span className="app-shell-dashboard-revenue-legend-item">
                  <span className="app-shell-dashboard-revenue-legend-swatch app-shell-dashboard-revenue-legend-swatch-prior" />
                  FY2025
                </span>
              </div>

              {barData.length === 0 ? (
                <p className="app-shell-dashboard-revenue-empty" role="status">
                  No revenue variance data available for this period.
                </p>
              ) : (
                <div
                  aria-label={barChartLabel}
                  className="app-shell-dashboard-revenue-bar-frame"
                  role="img"
                >
                  <ChartContainer config={revenueBarChartConfig}>
                    <BarChart
                      accessibilityLayer
                      aria-hidden="true"
                      barSize={12}
                      data={[...barData]}
                      margin={{ left: -25, right: 8, top: 8 }}
                      stackOffset="sign"
                    >
                      <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="6"
                        vertical={false}
                      />
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
                        domain={[yMin, yMax]}
                        tick={{ fill: "var(--muted-foreground)" }}
                        tickFormatter={(value: number) => String(value)}
                        tickLine={false}
                        tickMargin={8}
                        ticks={[...yAxisTicks]}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent hideLabel />}
                        cursor={false}
                      />
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
              )}
            </div>
          </section>

          <aside
            aria-labelledby={growthSectionId}
            className="app-shell-dashboard-revenue-secondary"
          >
            <div className="app-shell-dashboard-revenue-select-row">
              <label
                className="app-shell-dashboard-revenue-select-label"
                htmlFor={reportSelectId}
              >
                Report view
              </label>
              <Select defaultValue="revenue">
                <SelectTrigger id={reportSelectId}>
                  <SelectValue placeholder="Report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {REPORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="app-shell-dashboard-revenue-growth-panel">
              <div className="app-shell-dashboard-revenue-growth-headline">
                <span className="app-shell-dashboard-revenue-growth-value">
                  {growthLabel}
                </span>
                <span className="app-shell-dashboard-revenue-growth-headline-caption">
                  Growth
                </span>
              </div>

              <div
                aria-label="Portfolio revenue mix by period"
                className="app-shell-dashboard-revenue-growth-chart-frame app-shell-dashboard-revenue-growth-chart-frame-bars"
                role="img"
              >
                {growthData.length === 0 ? (
                  <p
                    className="app-shell-dashboard-revenue-empty"
                    role="status"
                  >
                    No growth mix data available for this period.
                  </p>
                ) : (
                  <ChartContainer config={revenueGrowthChartConfig}>
                    <BarChart
                      accessibilityLayer
                      aria-hidden="true"
                      barSize={8}
                      data={[...growthData]}
                      layout="vertical"
                      margin={{ bottom: 0, left: 4, right: 8, top: 0 }}
                    >
                      <XAxis hide type="number" />
                      <YAxis
                        axisLine={false}
                        dataKey="date"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        tickFormatter={formatGrowthDateTick}
                        tickLine={false}
                        type="category"
                        width={52}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent hideLabel />}
                        cursor={false}
                      />
                      <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                        {growthData.map((entry, index) => (
                          <Cell
                            fill={
                              index % 2 === 0
                                ? "var(--primary)"
                                : "color-mix(in oklab, var(--primary) 45%, transparent)"
                            }
                            key={entry.date}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                )}
              </div>

              <div className="app-shell-dashboard-revenue-growth-meta">
                <span className="app-shell-dashboard-revenue-growth-caption">
                  {growthCaption}
                </span>
                <span
                  className="app-shell-dashboard-revenue-growth-footnote"
                  id={growthSectionId}
                >
                  Portfolio growth index
                </span>
              </div>
            </div>

            <Separator />

            <div className="app-shell-dashboard-revenue-summary-row">
              {yearSummaries.map((summary) => (
                <RevenueYearSummaryItem key={summary.id} summary={summary} />
              ))}
            </div>
          </aside>
        </div>
      </Card>
    </article>
  );
}
