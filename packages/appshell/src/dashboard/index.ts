export type { ApplicationShellDashboardCanvasProps } from "./app-shell-dashboard-canvas.client";
export { ApplicationShellDashboardCanvas } from "./app-shell-dashboard-canvas.client";
export type { ApplicationShellDashboardDemoProps } from "./app-shell-dashboard-demo";
export { ApplicationShellDashboardDemo } from "./app-shell-dashboard-demo";
export type { DashboardGridLayoutAdapterProps } from "./dashboard-grid-layout-adapter.client";
export { DashboardGridLayoutAdapter } from "./dashboard-grid-layout-adapter.client";
export type { DashboardGridWidgetProps } from "./dashboard-grid-widget.client";
export { DashboardGridWidget } from "./dashboard-grid-widget.client";
export {
  DASHBOARD_GRID_BREAKPOINTS,
  DASHBOARD_GRID_MARGIN,
  type DashboardGridBreakpointKey,
  type DashboardLayoutPreset,
  type DashboardLayoutValidationResult,
  type DashboardWidgetLayoutItem,
} from "./dashboard-layout.contract";
export { DEFAULT_DASHBOARD_LAYOUT } from "./dashboard-layout.defaults";
export { migrateDashboardLayoutPreset } from "./dashboard-layout.migration";
export {
  dashboardLayoutPresetSchema,
  parseDashboardLayoutPreset,
} from "./dashboard-layout.schema";
export {
  resolveDashboardLayoutPreset,
  validateDashboardLayoutPreset,
} from "./dashboard-layout.validation";
export {
  APPSHELL_DASHBOARD_LAYOUT_STORAGE_KEY,
  clearStoredDashboardLayout,
  parseStoredDashboardLayout,
  readStoredDashboardLayout,
  writeStoredDashboardLayout,
} from "./dashboard-storage.client";
export {
  DASHBOARD_WIDGET_CAPABILITIES,
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS,
  type DashboardWidgetCategory,
  type DashboardWidgetDefinition,
  type DashboardWidgetId,
  type DashboardWidgetRenderContext,
  DEMO_DASHBOARD_WIDGET_CAPABILITIES,
  DEMO_DASHBOARD_WIDGET_PERMISSIONS,
  EMPTY_DASHBOARD_WIDGET_RENDER_CONTEXT,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
} from "./dashboard-widget.contract";
export {
  DASHBOARD_WIDGET_DEFINITIONS,
  DASHBOARD_WIDGET_REGISTRY,
  getDashboardWidgetRegistry,
  isDashboardWidgetId,
} from "./dashboard-widget-registry";
export {
  applyDashboardWidgetRenderContextPreview,
  type DashboardWidgetRenderContextPreviewMode,
  hydrateDashboardWidgetRenderContext,
  type SerializableDashboardWidgetRenderContext,
  serializeDashboardWidgetRenderContext,
} from "./dashboard-widget-render-context";
export {
  DashboardWidgetRenderContextProvider,
  useDashboardWidgetRenderContext,
  useOptionalDashboardWidgetRenderContext,
} from "./dashboard-widget-render-context.context";
export {
  filterLayoutItemsByVisibleWidgets,
  resolveDashboardWidgets,
} from "./dashboard-widget-resolve";
