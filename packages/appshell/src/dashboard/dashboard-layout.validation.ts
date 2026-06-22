import type {
  DashboardLayoutPreset,
  DashboardLayoutValidationResult,
} from "./dashboard-layout.contract";
import { migrateDashboardLayoutPreset } from "./dashboard-layout.migration";
import type {
  DashboardWidgetDefinition,
  DashboardWidgetId,
} from "./dashboard-widget.contract";
import { isDashboardWidgetId } from "./dashboard-widget-registry";

export function validateDashboardLayoutPreset(
  layout: DashboardLayoutPreset,
  registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>
): DashboardLayoutValidationResult {
  const migrated = migrateDashboardLayoutPreset(layout);

  for (const item of migrated.items) {
    if (!isDashboardWidgetId(item.i)) {
      return {
        valid: false,
        reason: `Unknown dashboard widget: ${item.i}`,
      };
    }

    const widget = registry.get(item.i);

    if (!widget) {
      return {
        valid: false,
        reason: `Unknown dashboard widget: ${item.i}`,
      };
    }

    if (item.w < widget.minW || item.h < widget.minH) {
      return {
        valid: false,
        reason: `Dashboard widget ${item.i} is below minimum size`,
      };
    }
  }

  return { valid: true, reason: null };
}

export function resolveDashboardLayoutPreset(
  candidate: DashboardLayoutPreset | null | undefined,
  registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>,
  fallback: DashboardLayoutPreset
): DashboardLayoutPreset {
  if (candidate === null || candidate === undefined) {
    return fallback;
  }

  const migrated = migrateDashboardLayoutPreset(candidate);
  const validation = validateDashboardLayoutPreset(migrated, registry);
  if (!validation.valid) {
    return fallback;
  }

  return migrated;
}
