import type {
  DashboardLayoutPreset,
  DashboardWidgetLayoutItem,
} from "./dashboard-layout.contract";
import type {
  DashboardKpiWidgetId,
  DashboardSparklineWidgetId,
  LegacyDashboardCompositeWidgetId,
} from "./dashboard-widget.contract";

const SPARKLINE_WIDGET_IDS = [
  "sparkline-revenue",
  "sparkline-expense",
] as const satisfies readonly DashboardSparklineWidgetId[];

const KPI_WIDGET_IDS = [
  "kpi-net-income",
  "kpi-active-orders",
  "kpi-headcount",
  "kpi-open-tasks",
] as const satisfies readonly DashboardKpiWidgetId[];

const LEGACY_COMPOSITE_WIDGET_IDS = [
  "sparkline-stats",
  "kpi-stats",
] as const satisfies readonly LegacyDashboardCompositeWidgetId[];

export function isLegacyDashboardCompositeWidgetId(
  value: string
): value is LegacyDashboardCompositeWidgetId {
  return (LEGACY_COMPOSITE_WIDGET_IDS as readonly string[]).includes(value);
}

function expandSparklineStatsItem(
  item: DashboardWidgetLayoutItem
): DashboardWidgetLayoutItem[] {
  const firstWidth = Math.max(3, Math.floor(item.w / 2));
  const secondWidth = Math.max(3, item.w - firstWidth);

  return [
    {
      i: SPARKLINE_WIDGET_IDS[0],
      x: item.x,
      y: item.y,
      w: firstWidth,
      h: item.h,
    },
    {
      i: SPARKLINE_WIDGET_IDS[1],
      x: item.x + firstWidth,
      y: item.y,
      w: secondWidth,
      h: item.h,
    },
  ];
}

function expandKpiStatsItem(
  item: DashboardWidgetLayoutItem
): DashboardWidgetLayoutItem[] {
  const segmentWidth = Math.max(3, Math.floor(item.w / KPI_WIDGET_IDS.length));

  return KPI_WIDGET_IDS.map((widgetId, index) => {
    const isLast = index === KPI_WIDGET_IDS.length - 1;
    const width = isLast ? Math.max(3, item.w - segmentWidth * index) : segmentWidth;

    return {
      i: widgetId,
      x: item.x + segmentWidth * index,
      y: item.y,
      w: width,
      h: item.h,
    };
  });
}

function expandLegacyLayoutItem(
  item: DashboardWidgetLayoutItem
): DashboardWidgetLayoutItem[] {
  if (item.i === "sparkline-stats") {
    return expandSparklineStatsItem(item);
  }

  if (item.i === "kpi-stats") {
    return expandKpiStatsItem(item);
  }

  return [item];
}

/** Expands legacy composite widget rows into one grid cell per metric widget. */
export function migrateDashboardLayoutPreset(
  layout: DashboardLayoutPreset
): DashboardLayoutPreset {
  const items: DashboardWidgetLayoutItem[] = [];

  for (const item of layout.items) {
    if (isLegacyDashboardCompositeWidgetId(item.i)) {
      items.push(...expandLegacyLayoutItem(item));
      continue;
    }

    items.push(item);
  }

  return {
    ...layout,
    items,
  };
}
