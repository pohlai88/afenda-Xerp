import type { GovernedUiComponentName } from "@afenda/ui/governance";

import type {
  AppShellDashboardSparklineMetric,
  AppShellDashboardSparklinePoint,
} from "../data/app-shell.dashboard.types";

export type AppShellDashboardStatisticsSparklineCardGovernedComponents =
  Extract<GovernedUiComponentName, "Card" | "Chart">;

/** Serializable boundary props for statistics-component-07 income/expense sparkline cards. */
export interface AppShellDashboardStatisticsSparklineCardProps {
  readonly amount: string;
  readonly changeLabel: string;
  readonly comparisonLabel: string;
  readonly data: readonly AppShellDashboardSparklinePoint[];
  readonly id: AppShellDashboardSparklineMetric["id"];
  readonly title: string;
  readonly trend: AppShellDashboardSparklineMetric["trend"];
}

export type AppShellDashboardStatisticsIncomeCardProps =
  AppShellDashboardStatisticsSparklineCardProps;

export type AppShellDashboardStatisticsExpenseCardProps =
  AppShellDashboardStatisticsSparklineCardProps;
