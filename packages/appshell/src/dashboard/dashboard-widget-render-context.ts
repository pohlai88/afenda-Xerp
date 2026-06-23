import type { DashboardWidgetRenderContext } from "./dashboard-widget.contract";
import {
  DEMO_DASHBOARD_WIDGET_PERMISSIONS,
  EMPTY_DASHBOARD_WIDGET_RENDER_CONTEXT,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
} from "./dashboard-widget.contract";

/** JSON-safe render context for server → client handoff. */
export interface SerializableDashboardWidgetRenderContext {
  readonly capabilities: readonly string[];
  readonly featureFlags: readonly string[];
  readonly permissions: readonly string[];
}

export type DashboardWidgetRenderContextPreviewMode =
  | "server"
  | "full"
  | "finance-only"
  | "restricted";

const FINANCE_ONLY_DASHBOARD_WIDGET_RENDER_CONTEXT = {
  permissions: new Set<string>(DEMO_DASHBOARD_WIDGET_PERMISSIONS),
  capabilities: new Set<string>(),
  featureFlags: new Set<string>(),
} satisfies DashboardWidgetRenderContext;

export function serializeDashboardWidgetRenderContext(
  context: DashboardWidgetRenderContext
): SerializableDashboardWidgetRenderContext {
  return {
    permissions: [...context.permissions],
    capabilities: [...context.capabilities],
    featureFlags: [...context.featureFlags],
  };
}

export function hydrateDashboardWidgetRenderContext(
  context: SerializableDashboardWidgetRenderContext
): DashboardWidgetRenderContext {
  return {
    permissions: new Set(context.permissions),
    capabilities: new Set(context.capabilities),
    featureFlags: new Set(context.featureFlags),
  };
}

export function applyDashboardWidgetRenderContextPreview(
  base: DashboardWidgetRenderContext,
  mode: DashboardWidgetRenderContextPreviewMode
): DashboardWidgetRenderContext {
  switch (mode) {
    case "full":
      return PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT;
    case "finance-only":
      return FINANCE_ONLY_DASHBOARD_WIDGET_RENDER_CONTEXT;
    case "restricted":
      return EMPTY_DASHBOARD_WIDGET_RENDER_CONTEXT;
    default:
      return base;
  }
}
