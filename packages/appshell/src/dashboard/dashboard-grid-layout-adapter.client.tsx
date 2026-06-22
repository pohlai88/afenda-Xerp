"use client";

import { useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import type { Layout, ResponsiveLayouts } from "react-grid-layout/legacy";

import type {
  DashboardLayoutPreset,
  DashboardWidgetLayoutItem,
} from "./dashboard-layout.contract";
import { DASHBOARD_GRID_BREAKPOINTS } from "./dashboard-layout.contract";
import { isDashboardWidgetId } from "./dashboard-layout.schema";

import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

function toGridLayoutItem(item: DashboardWidgetLayoutItem): Layout[number] {
  const gridItem: Layout[number] = {
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  };

  if (item.minW !== undefined) {
    return { ...gridItem, minW: item.minW };
  }

  if (item.minH !== undefined) {
    return { ...gridItem, minH: item.minH };
  }

  return gridItem;
}

function presetToLayouts(preset: DashboardLayoutPreset): ResponsiveLayouts {
  const layout = preset.items.map(toGridLayoutItem);

  return {
    desktop: layout,
    laptop: layout,
    tablet: layout,
    mobile: layout,
  };
}

function mapGridLayoutToItems(layout: Layout): DashboardWidgetLayoutItem[] {
  const items: DashboardWidgetLayoutItem[] = [];

  for (const entry of layout) {
    if (!isDashboardWidgetId(entry.i)) {
      continue;
    }

    const item: DashboardWidgetLayoutItem = {
      i: entry.i,
      x: entry.x,
      y: entry.y,
      w: entry.w,
      h: entry.h,
    };

    if (entry.minW !== undefined) {
      items.push({ ...item, minW: entry.minW });
      continue;
    }

    if (entry.minH !== undefined) {
      items.push({ ...item, minH: entry.minH });
      continue;
    }

    items.push(item);
  }

  return items;
}

export interface DashboardGridLayoutAdapterProps {
  readonly layout: DashboardLayoutPreset;
  readonly editMode: boolean;
  readonly onLayoutChange: (layout: DashboardLayoutPreset) => void;
  readonly children: React.ReactNode;
}

export function DashboardGridLayoutAdapter({
  layout,
  editMode,
  onLayoutChange,
  children,
}: DashboardGridLayoutAdapterProps) {
  const breakpoints = useMemo(
    () => ({
      desktop: DASHBOARD_GRID_BREAKPOINTS.desktop.breakpoint,
      laptop: DASHBOARD_GRID_BREAKPOINTS.laptop.breakpoint,
      tablet: DASHBOARD_GRID_BREAKPOINTS.tablet.breakpoint,
      mobile: DASHBOARD_GRID_BREAKPOINTS.mobile.breakpoint,
    }),
    []
  );

  const cols = useMemo(
    () => ({
      desktop: DASHBOARD_GRID_BREAKPOINTS.desktop.columns,
      laptop: DASHBOARD_GRID_BREAKPOINTS.laptop.columns,
      tablet: DASHBOARD_GRID_BREAKPOINTS.tablet.columns,
      mobile: DASHBOARD_GRID_BREAKPOINTS.mobile.columns,
    }),
    []
  );

  const layouts = useMemo(() => presetToLayouts(layout), [layout]);

  return (
    <ResponsiveGridLayout
      breakpoints={breakpoints}
      className="app-shell-dashboard-grid"
      cols={cols}
      draggableHandle=".app-shell-dashboard-drag-handle"
      isDraggable={editMode}
      isResizable={editMode}
      layouts={layouts}
      margin={[12, 12]}
      onLayoutChange={(currentLayout: Layout) => {
        if (!editMode) {
          return;
        }

        onLayoutChange({
          version: layout.version,
          columns: layout.columns,
          rowHeight: layout.rowHeight,
          items: mapGridLayoutToItems(currentLayout),
        });
      }}
      rowHeight={layout.rowHeight}
    >
      {children}
    </ResponsiveGridLayout>
  );
}
