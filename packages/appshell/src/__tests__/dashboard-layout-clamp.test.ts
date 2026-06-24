import { describe, expect, it } from "vitest";

import {
  clampWidgetToPolicy,
  normalizeDashboardLayout,
} from "../dashboard/dashboard-layout.clamp";
import type { DashboardLayoutPreset } from "../dashboard/dashboard-layout.contract";
import { DASHBOARD_GRID_BREAKPOINTS } from "../dashboard/dashboard-layout.contract";
import { DEFAULT_DASHBOARD_LAYOUT } from "../dashboard/dashboard-layout.defaults";
import {
  resolveDashboardLayoutPreset,
  validateDashboardLayoutPreset,
} from "../dashboard/dashboard-layout.validation";
import {
  DASHBOARD_WIDGET_DEFINITIONS,
  getDashboardWidgetRegistry,
} from "../dashboard/dashboard-widget-registry";

const registry = getDashboardWidgetRegistry();
const DESKTOP_COLS = DASHBOARD_GRID_BREAKPOINTS.desktop.columns;

describe("clampWidgetToPolicy", () => {
  it("leaves an already-valid item unchanged", () => {
    const item = { i: "kpi-net-income" as const, x: 0, y: 0, w: 3, h: 2 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    expect(result).toBe(item);
  });

  it("grows a widget below minimum width to minW", () => {
    const item = { i: "kpi-net-income" as const, x: 0, y: 0, w: 1, h: 2 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    const widget = registry.get("kpi-net-income");
    expect(result.w).toBe(widget?.minW);
  });

  it("grows a widget below minimum height to minH", () => {
    const item = { i: "kpi-net-income" as const, x: 0, y: 0, w: 3, h: 1 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    const widget = registry.get("kpi-net-income");
    expect(result.h).toBe(widget?.minH);
  });

  it("shrinks a KPI widget above maxW to maxW (acceptance criterion 3)", () => {
    const item = { i: "kpi-net-income" as const, x: 0, y: 0, w: 12, h: 2 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    const widget = registry.get("kpi-net-income");
    expect(result.w).toBe(widget?.maxW);
    expect(result.w).toBeLessThanOrEqual(6);
  });

  it("shrinks a KPI widget above maxH to maxH (acceptance criterion 3)", () => {
    const item = { i: "kpi-net-income" as const, x: 0, y: 0, w: 3, h: 99 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    const widget = registry.get("kpi-net-income");
    expect(result.h).toBe(widget?.maxH);
  });

  it("chart widget at minW=6 cannot be clamped below 6 (acceptance criterion 4)", () => {
    const item = { i: "revenue-chart" as const, x: 0, y: 0, w: 2, h: 3 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    const widget = registry.get("revenue-chart");
    expect(result.w).toBeGreaterThanOrEqual(widget?.minW ?? 0);
  });

  it("chart widget at maxW=12 cannot exceed desktop columns (acceptance criterion 5)", () => {
    const item = { i: "revenue-chart" as const, x: 0, y: 0, w: 99, h: 4 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    expect(result.w).toBeLessThanOrEqual(DESKTOP_COLS);
  });

  it("table widget cannot exceed DESKTOP_COLS width (acceptance criterion 6)", () => {
    const item = { i: "invoice-table" as const, x: 0, y: 0, w: 99, h: 5 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    expect(result.w).toBeLessThanOrEqual(DESKTOP_COLS);
  });

  it("returns original item for unknown widget id", () => {
    const item = { i: "unknown-widget" as never, x: 0, y: 0, w: 99, h: 99 };
    const result = clampWidgetToPolicy(item, registry, DESKTOP_COLS);
    expect(result).toBe(item);
  });
});

describe("normalizeDashboardLayout", () => {
  it("accepts the default layout without modification", () => {
    const result = normalizeDashboardLayout(DEFAULT_DASHBOARD_LAYOUT, registry);
    expect(result.items).toHaveLength(DEFAULT_DASHBOARD_LAYOUT.items.length);
    for (const item of result.items) {
      const original = DEFAULT_DASHBOARD_LAYOUT.items.find(
        (i) => i.i === item.i
      );
      expect(item.w).toBe(original?.w);
      expect(item.h).toBe(original?.h);
    }
  });

  it("drops items with unknown widget ids (acceptance criterion 7)", () => {
    const layout: DashboardLayoutPreset = {
      ...DEFAULT_DASHBOARD_LAYOUT,
      items: [
        { i: "kpi-net-income", x: 0, y: 0, w: 3, h: 2 },
        { i: "unknown-widget" as never, x: 3, y: 0, w: 6, h: 2 },
      ],
    };
    const result = normalizeDashboardLayout(layout, registry);
    expect(result.items.map((item) => item.i)).not.toContain("unknown-widget");
    expect(result.items).toHaveLength(1);
  });

  it("clamps oversized KPI items to their policy (acceptance criterion 7)", () => {
    const oversizedLayout: DashboardLayoutPreset = {
      ...DEFAULT_DASHBOARD_LAYOUT,
      items: [{ i: "kpi-net-income", x: 0, y: 0, w: 12, h: 10 }],
    };
    const result = normalizeDashboardLayout(oversizedLayout, registry);
    const kpi = result.items.find((item) => item.i === "kpi-net-income");
    const widget = registry.get("kpi-net-income");
    expect(kpi?.w).toBeLessThanOrEqual(widget?.maxW ?? 12);
    expect(kpi?.h).toBeLessThanOrEqual(widget?.maxH ?? 10);
  });

  it("preserves x/y position after clamping", () => {
    const layout: DashboardLayoutPreset = {
      ...DEFAULT_DASHBOARD_LAYOUT,
      items: [{ i: "kpi-net-income", x: 5, y: 3, w: 12, h: 99 }],
    };
    const result = normalizeDashboardLayout(layout, registry);
    const item = result.items[0];
    expect(item?.x).toBe(5);
    expect(item?.y).toBe(3);
  });
});

describe("resolveDashboardLayoutPreset with clamping", () => {
  it("returns fallback for null input", () => {
    const result = resolveDashboardLayoutPreset(
      null,
      registry,
      DEFAULT_DASHBOARD_LAYOUT
    );
    expect(result).toBe(DEFAULT_DASHBOARD_LAYOUT);
  });

  it("returns fallback for undefined input", () => {
    const result = resolveDashboardLayoutPreset(
      undefined,
      registry,
      DEFAULT_DASHBOARD_LAYOUT
    );
    expect(result).toBe(DEFAULT_DASHBOARD_LAYOUT);
  });

  it("rescues a layout with oversized KPI widgets instead of discarding (acceptance criterion 7)", () => {
    const oversizedLayout: DashboardLayoutPreset = {
      ...DEFAULT_DASHBOARD_LAYOUT,
      items: DEFAULT_DASHBOARD_LAYOUT.items.map((item) =>
        item.i === "kpi-net-income" ? { ...item, w: 12, h: 8 } : item
      ),
    };
    const result = resolveDashboardLayoutPreset(
      oversizedLayout,
      registry,
      DEFAULT_DASHBOARD_LAYOUT
    );
    const kpi = result.items.find((item) => item.i === "kpi-net-income");
    const widget = registry.get("kpi-net-income");
    expect(kpi).toBeDefined();
    expect(kpi?.w).toBeLessThanOrEqual(widget?.maxW ?? 12);
  });

  it("returns fallback when all items contain unknown ids after clamping", () => {
    const invalidLayout: DashboardLayoutPreset = {
      ...DEFAULT_DASHBOARD_LAYOUT,
      items: [{ i: "completely-unknown" as never, x: 0, y: 0, w: 4, h: 2 }],
    };
    const result = resolveDashboardLayoutPreset(
      invalidLayout,
      registry,
      DEFAULT_DASHBOARD_LAYOUT
    );
    expect(result).toBe(DEFAULT_DASHBOARD_LAYOUT);
  });

  it("accepts the default layout preset as-is", () => {
    const result = resolveDashboardLayoutPreset(
      DEFAULT_DASHBOARD_LAYOUT,
      registry,
      DEFAULT_DASHBOARD_LAYOUT
    );
    expect(result).toEqual(DEFAULT_DASHBOARD_LAYOUT);
  });
});

describe("validateDashboardLayoutPreset — max size boundary (acceptance criteria 3–6)", () => {
  it("rejects a KPI widget above maxW", () => {
    const kpiWidget = registry.get("kpi-net-income");
    if (!kpiWidget) return;

    const result = validateDashboardLayoutPreset(
      {
        ...DEFAULT_DASHBOARD_LAYOUT,
        items: [
          { i: "kpi-net-income", x: 0, y: 0, w: kpiWidget.maxW + 1, h: 2 },
        ],
      },
      registry
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("exceeds maximum size");
  });

  it("accepts a KPI widget at exactly maxW × maxH", () => {
    const kpiWidget = registry.get("kpi-net-income");
    if (!kpiWidget) return;

    const result = validateDashboardLayoutPreset(
      {
        ...DEFAULT_DASHBOARD_LAYOUT,
        items: [
          {
            i: "kpi-net-income",
            x: 0,
            y: 0,
            w: kpiWidget.maxW,
            h: kpiWidget.maxH,
          },
        ],
      },
      registry
    );
    expect(result.valid).toBe(true);
  });

  it("all registered widgets have maxW >= minW and maxH >= minH (registry integrity)", () => {
    for (const widget of DASHBOARD_WIDGET_DEFINITIONS) {
      expect(widget.maxW).toBeGreaterThanOrEqual(widget.minW);
      expect(widget.maxH).toBeGreaterThanOrEqual(widget.minH);
    }
  });

  it("all registered widgets have defaultW within [minW, maxW]", () => {
    for (const widget of DASHBOARD_WIDGET_DEFINITIONS) {
      expect(widget.defaultW).toBeGreaterThanOrEqual(widget.minW);
      expect(widget.defaultW).toBeLessThanOrEqual(widget.maxW);
    }
  });

  it("no widget has a maxW exceeding DESKTOP_COLS (no horizontal overflow)", () => {
    for (const widget of DASHBOARD_WIDGET_DEFINITIONS) {
      expect(widget.maxW).toBeLessThanOrEqual(DESKTOP_COLS);
    }
  });
});
