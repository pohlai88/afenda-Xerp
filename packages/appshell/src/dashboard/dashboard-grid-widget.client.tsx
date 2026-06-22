"use client";

import type { ReactNode } from "react";

import type { DashboardWidgetId } from "./dashboard-widget.contract";

export interface DashboardGridWidgetProps {
  readonly widgetId: DashboardWidgetId;
  readonly title: string;
  readonly editMode: boolean;
  readonly children: ReactNode;
}

/** One react-grid-layout cell wrapping a single dashboard widget instance. */
export function DashboardGridWidget({
  widgetId,
  title,
  editMode,
  children,
}: DashboardGridWidgetProps) {
  return (
    <div
      className="app-shell-dashboard-grid-item"
      data-dashboard-widget={widgetId}
    >
      {editMode ? (
        <button
          aria-label={`Drag ${title}`}
          className="app-shell-dashboard-drag-handle"
          type="button"
        />
      ) : null}
      <div className="app-shell-dashboard-grid-item-body">{children}</div>
    </div>
  );
}
