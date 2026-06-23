"use client";

import { useCallback, useMemo, useState } from "react";

import { DEFAULT_APP_SHELL_DASHBOARD_LABEL } from "../shadcn-studio/data/app-shell.dashboard.data";
import { DashboardGridLayoutAdapter } from "./dashboard-grid-layout-adapter.client";
import { DashboardGridWidget } from "./dashboard-grid-widget.client";
import type { DashboardLayoutPreset } from "./dashboard-layout.contract";
import { DEFAULT_DASHBOARD_LAYOUT } from "./dashboard-layout.defaults";
import { resolveDashboardLayoutPreset } from "./dashboard-layout.validation";
import {
  type DashboardWidgetRenderContext,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
} from "./dashboard-widget.contract";
import {
  DASHBOARD_WIDGET_DEFINITIONS,
  getDashboardWidgetRegistry,
  isDashboardWidgetId,
} from "./dashboard-widget-registry";
import {
  filterLayoutItemsByVisibleWidgets,
  resolveDashboardWidgets,
} from "./dashboard-widget-resolve";

export interface ApplicationShellDashboardCanvasProps {
  readonly dashboardLabel?: string;
  readonly editMode?: boolean;
  readonly layout?: DashboardLayoutPreset;
  readonly onLayoutChange?: (layout: DashboardLayoutPreset) => void;
  readonly renderContext?: DashboardWidgetRenderContext;
  readonly showReadonlyPreviewLabel?: boolean;
}

export function ApplicationShellDashboardCanvas({
  layout: layoutProp,
  editMode = false,
  onLayoutChange,
  dashboardLabel = DEFAULT_APP_SHELL_DASHBOARD_LABEL,
  renderContext = PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  showReadonlyPreviewLabel = false,
}: ApplicationShellDashboardCanvasProps) {
  const registry = getDashboardWidgetRegistry();
  const resolvedInitialLayout = useMemo(
    () =>
      resolveDashboardLayoutPreset(
        layoutProp,
        registry,
        DEFAULT_DASHBOARD_LAYOUT
      ),
    [layoutProp, registry]
  );

  // Store only user-initiated edits. Derived from resolvedInitialLayout during
  // render — avoids the useEffect → setState derived-state anti-pattern.
  const [localEdits, setLocalEdits] = useState<Partial<DashboardLayoutPreset>>(
    {}
  );
  const layout = { ...resolvedInitialLayout, ...localEdits };

  const visibleWidgets = useMemo(
    () => resolveDashboardWidgets(DASHBOARD_WIDGET_DEFINITIONS, renderContext),
    [renderContext]
  );

  const visibleWidgetIds = useMemo(
    () => new Set(visibleWidgets.map((widget) => widget.id)),
    [visibleWidgets]
  );

  const visibleLayoutItems = useMemo(
    () => filterLayoutItemsByVisibleWidgets(layout.items, visibleWidgetIds),
    [layout.items, visibleWidgetIds]
  );

  const visibleLayout = useMemo(
    () => ({
      ...layout,
      items: visibleLayoutItems,
    }),
    [layout, visibleLayoutItems]
  );

  const handleLayoutChange = useCallback(
    (nextLayout: DashboardLayoutPreset) => {
      const validated = resolveDashboardLayoutPreset(
        nextLayout,
        registry,
        DEFAULT_DASHBOARD_LAYOUT
      );
      setLocalEdits(validated);
      onLayoutChange?.(validated);
    },
    [onLayoutChange, registry]
  );

  if (visibleLayoutItems.length === 0) {
    return (
      <section
        aria-label={dashboardLabel}
        aria-live="polite"
        className="app-shell-dashboard app-shell-dashboard-empty-state"
      >
        {editMode ? (
          <p className="app-shell-dashboard-empty-state-copy">
            No widgets available. Adjust capabilities or add widgets to the
            registry.
          </p>
        ) : (
          <p className="app-shell-dashboard-empty-state-copy">
            Dashboard preview is empty for the current context.
          </p>
        )}
      </section>
    );
  }

  return (
    <section
      aria-label={dashboardLabel}
      className="app-shell-dashboard app-shell-dashboard-canvas"
      data-edit-mode={editMode ? "true" : "false"}
    >
      {editMode ? (
        <div className="app-shell-dashboard-edit-badge" role="status">
          Edit mode
        </div>
      ) : null}
      {showReadonlyPreviewLabel && !editMode ? (
        <div className="app-shell-dashboard-readonly-label" role="status">
          Readonly preview
        </div>
      ) : null}

      <DashboardGridLayoutAdapter
        editMode={editMode}
        layout={visibleLayout}
        onLayoutChange={handleLayoutChange}
        registry={registry}
      >
        {visibleLayoutItems.map((item) => {
          const widget = isDashboardWidgetId(item.i)
            ? registry.get(item.i)
            : undefined;
          if (widget === undefined) {
            return null;
          }

          return (
            <DashboardGridWidget
              editMode={editMode}
              key={item.i}
              title={widget.title}
              widgetId={widget.id}
            >
              {widget.render(renderContext)}
            </DashboardGridWidget>
          );
        })}
      </DashboardGridLayoutAdapter>
    </section>
  );
}
