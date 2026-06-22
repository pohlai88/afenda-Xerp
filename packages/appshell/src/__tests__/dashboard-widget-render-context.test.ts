import { describe, expect, it } from "vitest";

import {
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
} from "../dashboard/dashboard-widget.contract";
import {
  applyDashboardWidgetRenderContextPreview,
  hydrateDashboardWidgetRenderContext,
  serializeDashboardWidgetRenderContext,
} from "../dashboard/dashboard-widget-render-context";

describe("dashboard widget render context serialization", () => {
  it("round-trips permissions and capabilities through hydration", () => {
    const serialized = serializeDashboardWidgetRenderContext(
      PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
    );
    const hydrated = hydrateDashboardWidgetRenderContext(serialized);

    expect([...hydrated.permissions]).toEqual([
      ...PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT.permissions,
    ]);
    expect([...hydrated.capabilities]).toEqual([
      ...PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT.capabilities,
    ]);
  });

  it("applies finance-only preview mode without breakdown capabilities", () => {
    const preview = applyDashboardWidgetRenderContextPreview(
      PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
      "finance-only"
    );

    expect([...preview.permissions]).toEqual([...DASHBOARD_WIDGET_FINANCE_PERMISSIONS]);
    expect(preview.capabilities.size).toBe(0);
  });

  it("applies restricted preview mode with no grants", () => {
    const preview = applyDashboardWidgetRenderContextPreview(
      PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
      "restricted"
    );

    expect(preview.permissions.size).toBe(0);
    expect(preview.capabilities.size).toBe(0);
  });
});
