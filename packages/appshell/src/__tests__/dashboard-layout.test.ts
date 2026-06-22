import { describe, expect, it } from "vitest";

import { DEFAULT_DASHBOARD_LAYOUT } from "../dashboard/dashboard-layout.defaults";
import { parseDashboardLayoutPreset } from "../dashboard/dashboard-layout.schema";
import { validateDashboardLayoutPreset } from "../dashboard/dashboard-layout.validation";
import { getDashboardWidgetRegistry } from "../dashboard/dashboard-widget-registry";
import { resolveDashboardWidgets } from "../dashboard/dashboard-widget-resolve";
import { PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT } from "../dashboard/dashboard-widget.contract";

describe("dashboard layout validation", () => {
  const registry = getDashboardWidgetRegistry();

  it("accepts the default dashboard layout preset", () => {
    const result = validateDashboardLayoutPreset(DEFAULT_DASHBOARD_LAYOUT, registry);
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
            i: "kpi-stats",
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
});

describe("resolveDashboardWidgets", () => {
  it("filters widgets by required permission", () => {
    const widgets = [
      {
        id: "kpi-stats" as const,
        title: "KPI",
        description: "KPI",
        category: "kpi" as const,
        minW: 4,
        minH: 2,
        defaultW: 12,
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
  it("includes all registry widgets without governance requirements", () => {
    const registry = getDashboardWidgetRegistry();
    const visible = resolveDashboardWidgets(
      [...registry.values()],
      PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
    );

    expect(visible.length).toBe(registry.size);
  });
});
