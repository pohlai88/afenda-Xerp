"use client";

import { AppShellDashboardSparklineStat } from "./app-shell-dashboard-sparkline-stat";
import type {
  AppShellDashboardStatisticsIncomeCardProps,
  AppShellDashboardStatisticsSparklineCardGovernedComponents,
} from "./app-shell-dashboard-statistics-sparkline-card.shared";

export type {
  AppShellDashboardStatisticsSparklineCardGovernedComponents as AppShellDashboardStatisticsIncomeCardGovernedComponents,
};

/**
 * Income / revenue sparkline card — statistics-component-07 synthesis.
 * Delegates chart rendering to {@link AppShellDashboardSparklineStat}.
 */
export function AppShellDashboardStatisticsIncomeCard(
  props: AppShellDashboardStatisticsIncomeCardProps
) {
  return <AppShellDashboardSparklineStat {...props} metricKey="revenue" />;
}
