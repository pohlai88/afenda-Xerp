import type { ApplicationShellDashboardProps } from "../app-shell-dashboard";
import {
  DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  DEFAULT_APP_SHELL_DASHBOARD_LABEL,
} from "../shadcn-studio/data/app-shell.dashboard.data";

export const DASHBOARD_STORY_BASE_ARGS = {
  dashboardLabel: DEFAULT_APP_SHELL_DASHBOARD_LABEL,
  comparisonLabel: DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  showLegacyWidgets: true,
  showStatisticsMetrics: true,
  showStatisticsLineTrends: true,
} satisfies ApplicationShellDashboardProps;

export const MODERN_DASHBOARD_ARGS = {
  ...DASHBOARD_STORY_BASE_ARGS,
  showLegacyWidgets: false,
} satisfies ApplicationShellDashboardProps;

export const FINANCE_DASHBOARD_ARGS = {
  dashboardLabel: "Finance control tower",
  comparisonLabel: "vs prior period",
  showLegacyWidgets: false,
} satisfies ApplicationShellDashboardProps;

export const EMPTY_INVOICES_DASHBOARD_ARGS = {
  ...MODERN_DASHBOARD_ARGS,
  invoices: [],
} satisfies ApplicationShellDashboardProps;

export const EMPTY_REGIONAL_SALES_DASHBOARD_ARGS = {
  ...MODERN_DASHBOARD_ARGS,
  regionalSales: [],
} satisfies ApplicationShellDashboardProps;
