import type {
  DashboardWidgetDefinition,
  DashboardWidgetRenderContext,
} from "./dashboard-widget.contract";

export function resolveDashboardWidgets(
  widgets: readonly DashboardWidgetDefinition[],
  context: DashboardWidgetRenderContext
): readonly DashboardWidgetDefinition[] {
  return widgets.filter((widget) => {
    if (
      widget.requiredPermission !== undefined &&
      !context.permissions.has(widget.requiredPermission)
    ) {
      return false;
    }

    if (
      widget.requiredCapability !== undefined &&
      !context.capabilities.has(widget.requiredCapability)
    ) {
      return false;
    }

    if (
      widget.featureFlag !== undefined &&
      !context.featureFlags.has(widget.featureFlag)
    ) {
      return false;
    }

    return true;
  });
}

export function filterLayoutItemsByVisibleWidgets<
  T extends { readonly i: DashboardWidgetDefinition["id"] },
>(
  items: readonly T[],
  visibleWidgetIds: ReadonlySet<DashboardWidgetDefinition["id"]>
): readonly T[] {
  return items.filter((item) => visibleWidgetIds.has(item.i));
}
