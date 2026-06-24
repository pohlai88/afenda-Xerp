import type {
  DashboardLayoutPreset,
  DashboardWidgetLayoutItem,
} from "./dashboard-layout.contract";
import { DASHBOARD_GRID_BREAKPOINTS } from "./dashboard-layout.contract";
import type {
  DashboardWidgetDefinition,
  DashboardWidgetId,
} from "./dashboard-widget.contract";
import { isDashboardWidgetId } from "./dashboard-widget-registry";

/**
 * Clamps a single layout item's `w`/`h` to the registered widget's declared
 * `minW`/`minH`/`maxW`/`maxH` policy.
 *
 * Items whose `i` is unknown in the registry are returned unchanged so that
 * the caller can decide whether to drop or keep them.
 */
export function clampWidgetToPolicy(
  item: DashboardWidgetLayoutItem,
  registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>,
  gridColumns: number
): DashboardWidgetLayoutItem {
  if (!isDashboardWidgetId(item.i)) {
    return item;
  }

  const widget = registry.get(item.i);
  if (widget === undefined) {
    return item;
  }

  const clampedW = Math.min(
    Math.max(item.w, widget.minW),
    Math.min(widget.maxW, gridColumns)
  );
  const clampedH = Math.max(item.h, widget.minH);
  const maxH = widget.maxH;
  const finalH = clampedH > maxH ? maxH : clampedH;

  if (clampedW === item.w && finalH === item.h) {
    return item;
  }

  return { ...item, w: clampedW, h: finalH };
}

/**
 * Normalizes a full dashboard layout preset by clamping every item to its
 * registered widget's size policy.
 *
 * - Unknown widget ids are dropped (they cannot be rendered or constrained).
 * - Items that exceed the column count are clamped to the maximum column width.
 * - Items below minimum size are grown to the declared minimum.
 * - Items above maximum size are shrunk to the declared maximum.
 *
 * The resulting layout may still fail structural validation (e.g. duplicate
 * items), but all retained items will satisfy their registered size policy.
 */
export function normalizeDashboardLayout(
  preset: DashboardLayoutPreset,
  registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>
): DashboardLayoutPreset {
  const gridColumns =
    DASHBOARD_GRID_BREAKPOINTS.desktop.columns ?? preset.columns;

  const normalizedItems = preset.items.flatMap(
    (item): readonly DashboardWidgetLayoutItem[] => {
      if (!isDashboardWidgetId(item.i)) {
        return [];
      }

      return [clampWidgetToPolicy(item, registry, gridColumns)];
    }
  );

  return { ...preset, items: normalizedItems };
}
