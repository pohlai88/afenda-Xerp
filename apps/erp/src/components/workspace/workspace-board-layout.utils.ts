import { getWorkflowBoardHostMapping } from "@afenda/shadcn-studio-v2/metadata";
import type { Layout, LayoutItem } from "react-grid-layout";

import { resolveDashboardWidgetBridgeEntry } from "@/lib/workspace/dashboard-widget-bridge.registry";
import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

const TABLE_HOST_GRID_DEFAULT = getWorkflowBoardHostMapping(
  "data-table-surface"
)?.gridDefault;

/** Host-mapping default spans for board-hosted table widgets (ADR-0041 / A-09). */
export function resolveTableHostGridDefault(): {
  readonly h: number;
  readonly w: number;
} {
  return TABLE_HOST_GRID_DEFAULT ?? { h: 4, w: 12 };
}

function toGridLayoutItem(
  item: DashboardLayoutPresetDto["items"][number]
): LayoutItem {
  const bridge = resolveDashboardWidgetBridgeEntry(item.i);
  const isTableBlock =
    bridge?.blockId === "datatable-invoice" ||
    bridge?.blockId.startsWith("datatable-") === true;
  const minH = item.minH ?? bridge?.defaultLayout.minH;
  const minW = item.minW ?? bridge?.defaultLayout.minW;

  return {
    h: item.h ?? (isTableBlock ? TABLE_HOST_GRID_DEFAULT?.h : undefined) ?? item.h,
    i: item.i,
    w: item.w ?? (isTableBlock ? TABLE_HOST_GRID_DEFAULT?.w : undefined) ?? item.w,
    x: item.x,
    y: item.y,
    ...(minH === undefined ? {} : { minH }),
    ...(minW === undefined ? {} : { minW }),
  };
}

export function toGridLayoutItems(preset: DashboardLayoutPresetDto): Layout {
  return preset.items.map((item) => toGridLayoutItem(item));
}

export function toDashboardLayoutPreset(
  preset: DashboardLayoutPresetDto,
  nextLayout: Layout
): DashboardLayoutPresetDto {
  const nextByKey = new Map(nextLayout.map((entry) => [entry.i, entry]));

  return {
    columns: preset.columns,
    items: preset.items.map((item) => {
      const nextItem = nextByKey.get(item.i);

      if (nextItem === undefined) {
        return item;
      }

      return {
        h: nextItem.h,
        i: item.i,
        minH: item.minH,
        minW: item.minW,
        w: nextItem.w,
        x: nextItem.x,
        y: nextItem.y,
      };
    }),
    rowHeight: preset.rowHeight,
    version: preset.version,
  };
}

export function formatWidgetTitle(widgetKey: string): string {
  return widgetKey
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
