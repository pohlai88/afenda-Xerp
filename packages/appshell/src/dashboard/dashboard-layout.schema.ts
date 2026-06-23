import type {
  DashboardLayoutPreset,
  DashboardWidgetLayoutItem,
} from "./dashboard-layout.contract";
import {
  isLegacyDashboardCompositeWidgetId,
  migrateDashboardLayoutPreset,
} from "./dashboard-layout.migration";
import { isDashboardWidgetId } from "./dashboard-widget-registry";

export { isDashboardWidgetId };

function isParseableLayoutWidgetId(value: string): boolean {
  return (
    isDashboardWidgetId(value) || isLegacyDashboardCompositeWidgetId(value)
  );
}

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
  if (typeof idValue !== "string" || !isParseableLayoutWidgetId(idValue)) {
    return null;
  }

  if (
    !(
      isFiniteNumber(value["x"]) &&
      isFiniteNumber(value["y"]) &&
      isFiniteNumber(value["w"]) &&
      isFiniteNumber(value["h"])
    )
  ) {
    return null;
  }

  const item: DashboardWidgetLayoutItem = {
    i: idValue as DashboardWidgetLayoutItem["i"],
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

  return migrateDashboardLayoutPreset({
    version: 1,
    columns: 12,
    rowHeight: value["rowHeight"],
    items,
  });
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
