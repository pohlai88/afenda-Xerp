"use client";

import { useMemo } from "react";
import type { Layout, ResponsiveLayouts } from "react-grid-layout/legacy";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";

import type {
  DashboardLayoutPreset,
  DashboardWidgetLayoutItem,
} from "./dashboard-layout.contract";
import {
  DASHBOARD_GRID_BREAKPOINTS,
  DASHBOARD_GRID_MARGIN,
} from "./dashboard-layout.contract";
import type {
  DashboardWidgetDefinition,
  DashboardWidgetId,
} from "./dashboard-widget.contract";
import { isDashboardWidgetId } from "./dashboard-widget-registry";

import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

function toGridLayoutItem(
  item: DashboardWidgetLayoutItem,
  registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>
): Layout[number] {
  const widget = isDashboardWidgetId(item.i) ? registry.get(item.i) : undefined;

  const gridItem: Layout[number] = {
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  };

  let nextItem = gridItem;
  const minW = item.minW ?? widget?.minW;
  if (minW !== undefined) {
    nextItem = { ...nextItem, minW };
  }

  const minH = item.minH ?? widget?.minH;
  if (minH !== undefined) {
    nextItem = { ...nextItem, minH };
  }

  const maxW = item.maxW ?? widget?.maxW;
  if (maxW !== undefined) {
    nextItem = { ...nextItem, maxW };
  }

  const maxH = item.maxH ?? widget?.maxH;
  if (maxH !== undefined) {
    nextItem = { ...nextItem, maxH };
  }

  return nextItem;
}

function presetToLayouts(
  preset: DashboardLayoutPreset,
  registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>
): ResponsiveLayouts {
  const layout = preset.items.map((item) => toGridLayoutItem(item, registry));

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

    let nextItem: DashboardWidgetLayoutItem = item;

    if (entry.minW !== undefined) {
      nextItem = { ...nextItem, minW: entry.minW };
    }

    if (entry.minH !== undefined) {
      nextItem = { ...nextItem, minH: entry.minH };
    }

    if (entry.maxW !== undefined) {
      nextItem = { ...nextItem, maxW: entry.maxW };
    }

    if (entry.maxH !== undefined) {
      nextItem = { ...nextItem, maxH: entry.maxH };
    }

    items.push(nextItem);
  }

  return items;
}

export interface DashboardGridLayoutAdapterProps {
  readonly children: React.ReactNode;
  readonly editMode: boolean;
  readonly layout: DashboardLayoutPreset;
  readonly onLayoutChange: (layout: DashboardLayoutPreset) => void;
  readonly registry: ReadonlyMap<DashboardWidgetId, DashboardWidgetDefinition>;
}

export function DashboardGridLayoutAdapter({
  layout,
  editMode,
  onLayoutChange,
  registry,
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

  const layouts = useMemo(
    () => presetToLayouts(layout, registry),
    [layout, registry]
  );

  return (
    <ResponsiveGridLayout
      breakpoints={breakpoints}
      className="app-shell-dashboard-grid"
      cols={cols}
      draggableHandle=".app-shell-dashboard-drag-handle"
      isDraggable={editMode}
      isResizable={editMode}
      layouts={layouts}
      margin={[...DASHBOARD_GRID_MARGIN]}
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
