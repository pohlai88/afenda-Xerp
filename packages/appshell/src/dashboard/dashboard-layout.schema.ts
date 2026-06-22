import type {
  DashboardLayoutPreset,
  DashboardWidgetLayoutItem,
} from "./dashboard-layout.contract";
import type { DashboardWidgetId } from "./dashboard-widget.contract";

const DASHBOARD_WIDGET_IDS = [
  "invoice-table",
  "kpi-stats",
  "module-earnings",
  "payment-history",
  "recent-transactions",
  "regional-sales",
  "revenue-chart",
  "sparkline-stats",
  "statistics-line-trends",
  "statistics-metrics",
] as const satisfies readonly DashboardWidgetId[];

function isDashboardWidgetId(value: string): value is DashboardWidgetId {
  return (DASHBOARD_WIDGET_IDS as readonly string[]).includes(value);
}

export { isDashboardWidgetId };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseLayoutItem(value: unknown): DashboardWidgetLayoutItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const idValue = value["i"];
  if (typeof idValue !== "string" || !isDashboardWidgetId(idValue)) {
    return null;
  }

  if (
    !isFiniteNumber(value["x"]) ||
    !isFiniteNumber(value["y"]) ||
    !isFiniteNumber(value["w"]) ||
    !isFiniteNumber(value["h"])
  ) {
    return null;
  }

  const item: DashboardWidgetLayoutItem = {
    i: idValue,
    x: value["x"],
    y: value["y"],
    w: value["w"],
    h: value["h"],
  };

  let nextItem: DashboardWidgetLayoutItem = item;

  if (value["minW"] !== undefined) {
    if (!isFiniteNumber(value["minW"])) {
      return null;
    }
    nextItem = { ...nextItem, minW: value["minW"] };
  }

  if (value["minH"] !== undefined) {
    if (!isFiniteNumber(value["minH"])) {
      return null;
    }
    nextItem = { ...nextItem, minH: value["minH"] };
  }

  return nextItem;
}

export function parseDashboardLayoutPreset(
  value: unknown
): DashboardLayoutPreset | null {
  if (!isRecord(value)) {
    return null;
  }

  if (value["version"] !== 1 || value["columns"] !== 12) {
    return null;
  }

  if (!isFiniteNumber(value["rowHeight"]) || value["rowHeight"] <= 0) {
    return null;
  }

  if (!Array.isArray(value["items"])) {
    return null;
  }

  const items: DashboardWidgetLayoutItem[] = [];
  for (const entry of value["items"]) {
    const parsedItem = parseLayoutItem(entry);
    if (parsedItem === null) {
      return null;
    }
    items.push(parsedItem);
  }

  return {
    version: 1,
    columns: 12,
    rowHeight: value["rowHeight"],
    items,
  };
}

export const dashboardLayoutPresetSchema = {
  parse(value: unknown): DashboardLayoutPreset {
    const parsed = parseDashboardLayoutPreset(value);
    if (parsed === null) {
      throw new Error("Invalid dashboard layout preset.");
    }
    return parsed;
  },
};
