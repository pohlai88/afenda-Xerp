import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

import type { DashboardTierAV1WidgetId } from "./dashboard-widget-bridge.registry";
import { DASHBOARD_TIER_A_V1_WIDGET_IDS } from "./dashboard-widget-bridge.registry";

type DashboardLayoutItem = DashboardLayoutPresetDto["items"][number];

function itemForWidget(
  widgetId: DashboardTierAV1WidgetId,
  placement: Pick<DashboardLayoutItem, "h" | "w" | "x" | "y">
): DashboardLayoutItem {
  return {
    h: placement.h,
    i: widgetId,
    w: placement.w,
    x: placement.x,
    y: placement.y,
  };
}

/** Tier A v1 default layout — reference sales-dashboard ordering on 12-col grid. */
export const DASHBOARD_TIER_A_V1_DEFAULT_LAYOUT_ITEMS = [
  itemForWidget("kpi-net-income", { x: 0, y: 0, w: 4, h: 2 }),
  itemForWidget("statistics-line-trends", { x: 4, y: 0, w: 4, h: 2 }),
  itemForWidget("revenue-chart", { x: 8, y: 0, w: 4, h: 3 }),
  itemForWidget("payment-history", { x: 0, y: 2, w: 4, h: 3 }),
  itemForWidget("recent-transactions", { x: 4, y: 2, w: 4, h: 3 }),
  itemForWidget("invoice-table", { x: 0, y: 5, w: 12, h: 4 }),
] as const satisfies readonly DashboardLayoutItem[];

export const DASHBOARD_DEFAULT_LAYOUT_PRESET = {
  columns: 12,
  items: DASHBOARD_TIER_A_V1_DEFAULT_LAYOUT_ITEMS,
  rowHeight: 80,
  version: 1,
} as const satisfies DashboardLayoutPresetDto;

export function assertDashboardTierAV1PresetCoversBridge(): readonly DashboardTierAV1WidgetId[] {
  const presetIds = new Set(
    DASHBOARD_DEFAULT_LAYOUT_PRESET.items.map((item) => item.i)
  );

  return DASHBOARD_TIER_A_V1_WIDGET_IDS.filter(
    (widgetId) => !presetIds.has(widgetId)
  );
}
