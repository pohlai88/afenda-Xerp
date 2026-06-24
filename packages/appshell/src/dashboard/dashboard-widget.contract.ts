import type { ReactNode } from "react";

export type DashboardSparklineWidgetId =
  | "sparkline-expense"
  | "sparkline-revenue";

export type DashboardKpiWidgetId =
  | "kpi-active-orders"
  | "kpi-headcount"
  | "kpi-net-income"
  | "kpi-open-tasks";

/** Legacy composite rows migrated to individual metric widgets on load. */
export type LegacyDashboardCompositeWidgetId = "kpi-stats" | "sparkline-stats";

export type DashboardWidgetId =
  | DashboardKpiWidgetId
  | DashboardSparklineWidgetId
  | "invoice-table"
  | "module-earnings"
  | "payment-history"
  | "recent-transactions"
  | "regional-sales"
  | "revenue-chart"
  | "statistics-line-trends"
  | "statistics-metrics";

export type DashboardWidgetCategory =
  | "activity"
  | "chart"
  | "kpi"
  | "status"
  | "table";

export interface DashboardWidgetRenderContext {
  readonly capabilities: ReadonlySet<string>;
  readonly featureFlags: ReadonlySet<string>;
  readonly permissions: ReadonlySet<string>;
}

export interface DashboardWidgetDefinition {
  readonly category: DashboardWidgetCategory;
  readonly defaultH: number;
  readonly defaultW: number;
  readonly description: string;
  readonly featureFlag?: string;
  readonly id: DashboardWidgetId;
  readonly maxH: number;
  readonly maxW: number;
  readonly minH: number;
  readonly minW: number;
  readonly render: (context: DashboardWidgetRenderContext) => ReactNode;
  readonly requiredCapability?: string;
  readonly requiredPermission?: string;
  readonly title: string;
}

/** Finance permissions that unlock governed dashboard widgets. */
export const DASHBOARD_WIDGET_FINANCE_PERMISSIONS = [
  "finance.invoices_read",
  "finance.cards_read",
  "finance.transactions_read",
] as const;

/** Capability keys for breakdown dashboard widgets (backed by dashboard.* permissions). */
export const DASHBOARD_WIDGET_CAPABILITIES = [
  "dashboard.module_earnings",
  "dashboard.regional_sales",
] as const;

/** Demo / Storybook permissions that unlock governed finance widgets. */
export const DEMO_DASHBOARD_WIDGET_PERMISSIONS =
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS;

/** Demo / Storybook capabilities that unlock governed breakdown widgets. */
export const DEMO_DASHBOARD_WIDGET_CAPABILITIES = DASHBOARD_WIDGET_CAPABILITIES;

/** Empty render context — only ungated widgets remain visible. */
export const EMPTY_DASHBOARD_WIDGET_RENDER_CONTEXT = {
  permissions: new Set<string>(),
  capabilities: new Set<string>(),
  featureFlags: new Set<string>(),
} satisfies DashboardWidgetRenderContext;

/**
 * Default render context for demos and readonly previews.
 * Grants all demo permissions and capabilities so the full widget registry renders.
 */
export const PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT = {
  permissions: new Set<string>(DEMO_DASHBOARD_WIDGET_PERMISSIONS),
  capabilities: new Set<string>(DEMO_DASHBOARD_WIDGET_CAPABILITIES),
  featureFlags: new Set<string>(),
} satisfies DashboardWidgetRenderContext;
