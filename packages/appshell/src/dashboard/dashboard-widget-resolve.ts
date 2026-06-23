import type { DashboardWidgetLayoutItem } from "./dashboard-layout.contract";
import type {
  DashboardWidgetDefinition,
  DashboardWidgetRenderContext,
} from "./dashboard-widget.contract";
import { isDashboardWidgetId } from "./dashboard-widget-registry";

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

export function filterLayoutItemsByVisibleWidgets(
  items: readonly DashboardWidgetLayoutItem[],
  visibleWidgetIds: ReadonlySet<DashboardWidgetDefinition["id"]>
): readonly DashboardWidgetLayoutItem[] {
  return items.filter(
    (item) => isDashboardWidgetId(item.i) && visibleWidgetIds.has(item.i)
  );
}
