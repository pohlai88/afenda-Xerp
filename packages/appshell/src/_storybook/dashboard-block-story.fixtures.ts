import {
  DASHBOARD_WIDGET_CAPABILITIES,
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS,
  type DashboardWidgetRenderContext,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
} from "../dashboard/dashboard-widget.contract";
import {
  DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  defaultAppShellDashboardInvoices,
  defaultAppShellDashboardKpiMetrics,
  defaultAppShellDashboardModuleEarnings,
  defaultAppShellDashboardPaymentHistory,
  defaultAppShellDashboardRegionalSales,
  defaultAppShellDashboardSparklineMetrics,
  defaultAppShellDashboardTransactions,
} from "../presentation/data/app-shell.dashboard.data";

export {
  DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  defaultAppShellDashboardInvoices,
  defaultAppShellDashboardKpiMetrics,
  defaultAppShellDashboardModuleEarnings,
  defaultAppShellDashboardPaymentHistory,
  defaultAppShellDashboardRegionalSales,
  defaultAppShellDashboardSparklineMetrics,
  defaultAppShellDashboardTransactions,
};

export const DASHBOARD_BLOCK_STORY_COMPARISON_LABEL =
  DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL;

/** Full demo context — all finance permissions and dashboard capabilities. */
export const PERMISSIVE_BLOCK_STORY_RENDER_CONTEXT =
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT;

/** Breakdown widgets only — finance table widgets hidden. */
export const FINANCE_DENIED_BLOCK_STORY_RENDER_CONTEXT = {
  permissions: new Set<string>(),
  capabilities: new Set<string>(DASHBOARD_WIDGET_CAPABILITIES),
  featureFlags: new Set<string>(),
} satisfies DashboardWidgetRenderContext;

/** Finance tables only — breakdown capabilities hidden. */
export const FINANCE_ONLY_BLOCK_STORY_RENDER_CONTEXT = {
  permissions: new Set<string>(DASHBOARD_WIDGET_FINANCE_PERMISSIONS),
  capabilities: new Set<string>(),
  featureFlags: new Set<string>(),
} satisfies DashboardWidgetRenderContext;
