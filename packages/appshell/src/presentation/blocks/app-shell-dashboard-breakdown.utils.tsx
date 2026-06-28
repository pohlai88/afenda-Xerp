import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import type { AppShellTrendDirection } from "../data/app-shell.dashboard.types";

export interface DashboardBreakdownAggregateTrend {
  readonly label: string;
  readonly trend: AppShellTrendDirection;
}

export interface DashboardBreakdownTrendRow {
  readonly amount: string;
  readonly changeLabel: string;
}

const DASHBOARD_AMOUNT_PATTERN = /[$,]/g;
const DASHBOARD_CHANGE_LABEL_PATTERN = /[%+]/g;

function parseNumericToken(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseDashboardAmount(value: string): number {
  return parseNumericToken(value.replaceAll(DASHBOARD_AMOUNT_PATTERN, ""));
}

export function formatDashboardCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function computeDashboardShare(amount: string, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((parseDashboardAmount(amount) / total) * 100);
}

function parseChangeLabel(changeLabel: string): number {
  return parseNumericToken(
    changeLabel.replaceAll(DASHBOARD_CHANGE_LABEL_PATTERN, "")
  );
}

function formatDashboardTrendLabel(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

export function computeWeightedDashboardTrend(
  rows: readonly DashboardBreakdownTrendRow[]
): DashboardBreakdownAggregateTrend {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const row of rows) {
    const weight = parseDashboardAmount(row.amount);
    weightedSum += parseChangeLabel(row.changeLabel) * weight;
    totalWeight += weight;
  }

  if (totalWeight <= 0) {
    return { label: formatDashboardTrendLabel(0), trend: "up" };
  }

  const average = weightedSum / totalWeight;

  return {
    label: formatDashboardTrendLabel(average),
    trend: average >= 0 ? "up" : "down",
  };
}

export function TrendIndicator({
  trend,
}: {
  readonly trend: AppShellTrendDirection;
}) {
  return (
    <span className="app-shell-dashboard-trend-indicator">
      {trend === "up" ? (
        <ChevronUpIcon
          aria-hidden
          className="app-shell-dashboard-trend-icon-up"
        />
      ) : (
        <ChevronDownIcon
          aria-hidden
          className="app-shell-dashboard-trend-icon-down"
        />
      )}
      <span className="sr-only">
        {trend === "up" ? "Trending up" : "Trending down"}
      </span>
    </span>
  );
}
