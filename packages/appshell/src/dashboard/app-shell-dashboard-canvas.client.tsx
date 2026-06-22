"use client";

import { useCallback, useMemo, useState } from "react";

import { DEFAULT_APP_SHELL_DASHBOARD_LABEL } from "../shadcn-studio/data/app-shell.dashboard.data";
import { DashboardGridLayoutAdapter } from "./dashboard-grid-layout-adapter.client";
import { DEFAULT_DASHBOARD_LAYOUT } from "./dashboard-layout.defaults";
import type { DashboardLayoutPreset } from "./dashboard-layout.contract";
import { resolveDashboardLayoutPreset } from "./dashboard-layout.validation";
import {
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  type DashboardWidgetRenderContext,
} from "./dashboard-widget.contract";
import {
  filterLayoutItemsByVisibleWidgets,
  resolveDashboardWidgets,
} from "./dashboard-widget-resolve";
import {
  DASHBOARD_WIDGET_DEFINITIONS,
  getDashboardWidgetRegistry,
} from "./dashboard-widget-registry";

export interface ApplicationShellDashboardCanvasProps {
  readonly layout?: DashboardLayoutPreset;
  readonly editMode?: boolean;
  readonly onLayoutChange?: (layout: DashboardLayoutPreset) => void;
  readonly dashboardLabel?: string;
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
  const resolvedInitialLayout = resolveDashboardLayoutPreset(
    layoutProp,
    registry,
    DEFAULT_DASHBOARD_LAYOUT
  );

  const [layout, setLayout] = useState(resolvedInitialLayout);

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
      setLayout(validated);
      onLayoutChange?.(validated);
    },
    [onLayoutChange, registry]
  );

  if (visibleLayoutItems.length === 0) {
    return (
      <div
        aria-label={dashboardLabel}
        className="app-shell-dashboard app-shell-dashboard-empty-state"
        role="region"
      >
        {editMode ? (
          <p className="app-shell-dashboard-empty-state-copy">
            No widgets available. Adjust capabilities or add widgets to the registry.
          </p>
        ) : (
          <p className="app-shell-dashboard-empty-state-copy">
            Dashboard preview is empty for the current context.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      aria-label={dashboardLabel}
      className="app-shell-dashboard app-shell-dashboard-canvas"
      role="region"
    >
      {editMode ? (
        <div className="app-shell-dashboard-edit-badge">Edit mode</div>
      ) : null}
      {showReadonlyPreviewLabel && !editMode ? (
        <div className="app-shell-dashboard-readonly-label">Readonly preview</div>
      ) : null}

      <DashboardGridLayoutAdapter
        editMode={editMode}
        layout={visibleLayout}
        onLayoutChange={handleLayoutChange}
      >
        {visibleLayoutItems.map((item) => {
          const widget = registry.get(item.i);
          if (widget === undefined) {
            return null;
          }

          return (
            <div className="app-shell-dashboard-grid-item" key={item.i}>
              {editMode ? (
                <button
                  aria-label={`Drag ${widget.title}`}
                  className="app-shell-dashboard-drag-handle"
                  type="button"
                />
              ) : null}
              <div className="app-shell-dashboard-grid-item-body">
                {widget.render(renderContext)}
              </div>
            </div>
          );
        })}
      </DashboardGridLayoutAdapter>
    </div>
  );
}
