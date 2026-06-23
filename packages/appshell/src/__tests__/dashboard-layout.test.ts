import { describe, expect, it } from "vitest";

import { DEFAULT_DASHBOARD_LAYOUT } from "../dashboard/dashboard-layout.defaults";
import { parseDashboardLayoutPreset } from "../dashboard/dashboard-layout.schema";
import { validateDashboardLayoutPreset } from "../dashboard/dashboard-layout.validation";
import {
  type DashboardWidgetId,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
} from "../dashboard/dashboard-widget.contract";
import {
  DASHBOARD_WIDGET_DEFINITIONS,
  getDashboardWidgetRegistry,
  isDashboardWidgetId,
} from "../dashboard/dashboard-widget-registry";
import { resolveDashboardWidgets } from "../dashboard/dashboard-widget-resolve";

describe("dashboard widget registry ids", () => {
  it("derives isDashboardWidgetId from registry keys", () => {
    for (const definition of DASHBOARD_WIDGET_DEFINITIONS) {
      expect(isDashboardWidgetId(definition.id)).toBe(true);
    }

    expect(isDashboardWidgetId("unknown-widget")).toBe(false);
  });

  it("keeps registry ids aligned with the DashboardWidgetId union", () => {
    const ids: DashboardWidgetId[] = DASHBOARD_WIDGET_DEFINITIONS.map(
      (definition) => definition.id
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(getDashboardWidgetRegistry().size);
  });
});

describe("dashboard layout validation", () => {
  const registry = getDashboardWidgetRegistry();

  it("accepts the default dashboard layout preset", () => {
    const result = validateDashboardLayoutPreset(
      DEFAULT_DASHBOARD_LAYOUT,
      registry
    );
    expect(result).toEqual({ valid: true, reason: null });
  });

  it("rejects unknown widget ids", () => {
    const invalidLayout = {
      ...DEFAULT_DASHBOARD_LAYOUT,
      items: [
        {
          i: "unknown-widget",
          x: 0,
          y: 0,
          w: 4,
          h: 2,
        },
      ],
    };

    const parsed = parseDashboardLayoutPreset(invalidLayout);
    expect(parsed).toBeNull();
  });

  it("rejects widgets below registered minimum size", () => {
    const result = validateDashboardLayoutPreset(
      {
        ...DEFAULT_DASHBOARD_LAYOUT,
        items: [
          {
            i: "kpi-net-income",
            x: 0,
            y: 0,
            w: 1,
            h: 1,
          },
        ],
      },
      registry
    );

    expect(result.valid).toBe(false);
    expect(result.reason).toContain("below minimum size");
  });

  it("migrates legacy composite widget rows into individual metric widgets", () => {
    const migrated = parseDashboardLayoutPreset({
      version: 1,
      columns: 12,
      rowHeight: 80,
      items: [
        { i: "sparkline-stats", x: 0, y: 0, w: 12, h: 2 },
        { i: "kpi-stats", x: 0, y: 2, w: 12, h: 2 },
      ],
    });

    expect(migrated?.items.map((item) => item.i)).toEqual([
      "sparkline-revenue",
      "sparkline-expense",
      "kpi-net-income",
      "kpi-active-orders",
      "kpi-headcount",
      "kpi-open-tasks",
    ]);
  });

  it("default layout assigns one grid cell per metric widget", () => {
    const ids = DEFAULT_DASHBOARD_LAYOUT.items.map((item) => item.i);
    expect(ids).not.toContain("sparkline-stats");
    expect(ids).not.toContain("kpi-stats");
    expect(ids).toContain("sparkline-revenue");
    expect(ids).toContain("kpi-net-income");
  });
});

describe("resolveDashboardWidgets", () => {
  it("filters widgets by required permission", () => {
    const widgets = [
      {
        id: "kpi-net-income" as const,
        title: "Net income",
        description: "KPI",
        category: "kpi" as const,
        minW: 3,
        minH: 2,
        defaultW: 3,
        defaultH: 2,
        requiredPermission: "finance.read",
        render: () => null,
      },
    ];

    const denied = resolveDashboardWidgets(widgets, {
      permissions: new Set<string>(),
      capabilities: new Set<string>(),
      featureFlags: new Set<string>(),
    });

    const allowed = resolveDashboardWidgets(widgets, {
      permissions: new Set<string>(["finance.read"]),
      capabilities: new Set<string>(),
      featureFlags: new Set<string>(),
    });

    expect(denied).toHaveLength(0);
    expect(allowed).toHaveLength(1);
  });
});

describe("parseDashboardLayoutPreset", () => {
  it("returns null for invalid persisted JSON shapes", () => {
    expect(parseDashboardLayoutPreset({ version: 2 })).toBeNull();
    expect(parseDashboardLayoutPreset(null)).toBeNull();
  });

  it("parses a valid layout preset", () => {
    const parsed = parseDashboardLayoutPreset(DEFAULT_DASHBOARD_LAYOUT);
    expect(parsed).toEqual(DEFAULT_DASHBOARD_LAYOUT);
  });
});

describe("resolveDashboardWidgets permissive demo context", () => {
  it("includes all registry widgets when demo context grants access", () => {
    const registry = getDashboardWidgetRegistry();
    const visible = resolveDashboardWidgets(
      [...registry.values()],
      PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
    );

    expect(visible.length).toBe(registry.size);
  });

  it("hides finance widgets when permissions are missing", () => {
    const registry = getDashboardWidgetRegistry();
    const visible = resolveDashboardWidgets([...registry.values()], {
      permissions: new Set<string>(),
      capabilities: new Set<string>([
        "dashboard.module_earnings",
        "dashboard.regional_sales",
      ]),
      featureFlags: new Set<string>(),
    });

    const visibleIds = visible.map((widget) => widget.id);
    expect(visibleIds).not.toContain("invoice-table");
    expect(visibleIds).not.toContain("payment-history");
    expect(visibleIds).not.toContain("recent-transactions");
    expect(visibleIds).toContain("module-earnings");
    expect(visibleIds).toContain("regional-sales");
  });
});
