import type { ReactNode } from "react";

export type DashboardWidgetId =
  | "invoice-table"
  | "kpi-stats"
  | "module-earnings"
  | "payment-history"
  | "recent-transactions"
  | "regional-sales"
  | "revenue-chart"
  | "sparkline-stats"
  | "statistics-line-trends"
  | "statistics-metrics";

export type DashboardWidgetCategory =
  | "activity"
  | "chart"
  | "kpi"
  | "status"
  | "table";

export interface DashboardWidgetRenderContext {
  readonly permissions: ReadonlySet<string>;
  readonly capabilities: ReadonlySet<string>;
  readonly featureFlags: ReadonlySet<string>;
}

export interface DashboardWidgetDefinition {
  readonly id: DashboardWidgetId;
  readonly title: string;
  readonly description: string;
  readonly category: DashboardWidgetCategory;
  readonly minW: number;
  readonly minH: number;
  readonly defaultW: number;
  readonly defaultH: number;
  readonly requiredPermission?: string;
  readonly requiredCapability?: string;
  readonly featureFlag?: string;
  readonly render: (context: DashboardWidgetRenderContext) => ReactNode;
}

export const PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT = {
  permissions: new Set<string>(),
  capabilities: new Set<string>(),
  featureFlags: new Set<string>(),
} satisfies DashboardWidgetRenderContext;
