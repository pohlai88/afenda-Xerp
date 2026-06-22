import type {
  DashboardLayoutPreset,
  DashboardLayoutValidationResult,
} from "./dashboard-layout.contract";
import type {
  DashboardWidgetDefinition,
  DashboardWidgetId,
} from "./dashboard-widget.contract";

export function validateDashboardLayoutPreset(
  layout: DashboardLayoutPreset,
  registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>
): DashboardLayoutValidationResult {
  for (const item of layout.items) {
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

  const validation = validateDashboardLayoutPreset(candidate, registry);
  if (!validation.valid) {
    return fallback;
  }

  return candidate;
}
