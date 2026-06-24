import { normalizeDashboardLayout } from "./dashboard-layout.clamp";
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

    if (item.w > widget.maxW || item.h > widget.maxH) {
      return {
        valid: false,
        reason: `Dashboard widget ${item.i} exceeds maximum size`,
      };
    }
  }

  return { valid: true, reason: null };
}

/**
 * Resolves a persisted layout preset against the widget registry.
 *
 * Normalisation order:
 * 1. Migrate legacy composite widget ids.
 * 2. Clamp every item to its registered size policy (min/max).
 * 3. Validate the clamped result — if still invalid, fall back to `fallback`.
 *
 * This means a persisted layout that was simply over- or under-sized will be
 * rescued rather than discarded, while a layout with truly unknown widget ids
 * still falls back to the default.
 */
export function resolveDashboardLayoutPreset(
  candidate: DashboardLayoutPreset | null | undefined,
  registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>,
  fallback: DashboardLayoutPreset
): DashboardLayoutPreset {
  if (candidate === null || candidate === undefined) {
    return fallback;
  }

  const migrated = migrateDashboardLayoutPreset(candidate);
  const normalized = normalizeDashboardLayout(migrated, registry);

  // If normalization removes every item (all were unknown), fall back to default
  // rather than persisting an empty dashboard.
  if (normalized.items.length === 0) {
    return fallback;
  }

  const validation = validateDashboardLayoutPreset(normalized, registry);
  if (!validation.valid) {
    return fallback;
  }

  return normalized;
}
