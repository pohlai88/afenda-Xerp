"use client";

import { AppShellDashboardSparklineStat } from "./app-shell-dashboard-sparkline-stat";
import type {
  AppShellDashboardStatisticsExpenseCardProps,
  AppShellDashboardStatisticsSparklineCardGovernedComponents,
} from "./app-shell-dashboard-statistics-sparkline-card.shared";

export type {
  AppShellDashboardStatisticsSparklineCardGovernedComponents as AppShellDashboardStatisticsExpenseCardGovernedComponents,
};

/**
 * Expense sparkline card — statistics-component-07 synthesis.
 * Delegates chart rendering to {@link AppShellDashboardSparklineStat}.
 */
export function AppShellDashboardStatisticsExpenseCard(
  props: AppShellDashboardStatisticsExpenseCardProps
) {
  return <AppShellDashboardSparklineStat {...props} metricKey="expense" />;
}
