import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import type { AppShellTrendDirection } from "../data/app-shell.dashboard.types";

export interface DashboardBreakdownAggregateTrend {
  readonly label: string;
  readonly trend: AppShellTrendDirection;
}

export function parseDashboardAmount(value: string): number {
  return Number.parseFloat(value.replaceAll(/[$,]/g, ""));
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
  return Number.parseFloat(changeLabel.replaceAll(/[%+]/g, ""));
}

export function computeWeightedDashboardTrend(
  rows: readonly { readonly amount: string; readonly changeLabel: string }[]
): DashboardBreakdownAggregateTrend {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const row of rows) {
    const weight = parseDashboardAmount(row.amount);
    weightedSum += parseChangeLabel(row.changeLabel) * weight;
    totalWeight += weight;
  }

  if (totalWeight <= 0) {
    return { label: "0%", trend: "up" };
  }

  const average = weightedSum / totalWeight;
  const prefix = average > 0 ? "+" : "";

  return {
    label: `${prefix}${average.toFixed(1)}%`,
    trend: average >= 0 ? "up" : "down",
  };
}

export function TrendIndicator({ trend }: { readonly trend: AppShellTrendDirection }) {
  return trend === "up" ? (
    <ChevronUpIcon aria-hidden className="app-shell-dashboard-trend-icon-up" />
  ) : (
    <ChevronDownIcon aria-hidden className="app-shell-dashboard-trend-icon-down" />
  );
}
