import {
  MCP_SEED_BLOCK_IDS,
  resolveStudioBlockComponent,
} from "@afenda/shadcn-studio";
import { describe, expect, it } from "vitest";

import { dashboardLayoutPresetSchema } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

import {
  assertDashboardTierAV1PresetCoversBridge,
  DASHBOARD_DEFAULT_LAYOUT_PRESET,
} from "../dashboard-default-layout.preset";
import {
  DASHBOARD_CANONICAL_WIDGET_IDS,
  DASHBOARD_LEGACY_WIDGET_IDS,
  DASHBOARD_TIER_A_V1_WIDGET_IDS,
  DASHBOARD_WIDGET_BRIDGE_REGISTRY,
  listDashboardCanonicalWidgetBridgeKeys,
} from "../dashboard-widget-bridge.registry";

describe("dashboard-widget-bridge.registry", () => {
  it("maps every canonical API widget id to a resolvable studio block", () => {
    for (const widgetId of listDashboardCanonicalWidgetBridgeKeys()) {
      const entry = DASHBOARD_WIDGET_BRIDGE_REGISTRY[widgetId];
      expect(MCP_SEED_BLOCK_IDS).toContain(entry.blockId);
      expect(resolveStudioBlockComponent(entry.blockId)).toBeDefined();
    }
  });

  it("maps legacy widget ids to resolvable studio blocks", () => {
    for (const widgetId of DASHBOARD_LEGACY_WIDGET_IDS) {
      const entry = DASHBOARD_WIDGET_BRIDGE_REGISTRY[widgetId];
      expect(MCP_SEED_BLOCK_IDS).toContain(entry.blockId);
      expect(resolveStudioBlockComponent(entry.blockId)).toBeDefined();
    }
  });

  it("covers all canonical widget ids exactly once in the registry", () => {
    expect(Object.keys(DASHBOARD_WIDGET_BRIDGE_REGISTRY)).toEqual(
      expect.arrayContaining([
        ...DASHBOARD_CANONICAL_WIDGET_IDS,
        ...DASHBOARD_LEGACY_WIDGET_IDS,
      ])
    );
    expect(listDashboardCanonicalWidgetBridgeKeys()).toHaveLength(
      DASHBOARD_CANONICAL_WIDGET_IDS.length
    );
  });

  it("resolves Tier A v1 widget ids to live preview components", () => {
    for (const widgetId of DASHBOARD_TIER_A_V1_WIDGET_IDS) {
      const blockId = DASHBOARD_WIDGET_BRIDGE_REGISTRY[widgetId].blockId;
      expect(resolveStudioBlockComponent(blockId)).toBeDefined();
    }
  });
});

describe("dashboard-default-layout.preset", () => {
  it("validates against the dashboard layout API schema", () => {
    const parsed = dashboardLayoutPresetSchema.safeParse(
      DASHBOARD_DEFAULT_LAYOUT_PRESET
    );
    expect(parsed.success).toBe(true);
  });

  it("includes every Tier A v1 widget in the default preset", () => {
    expect(assertDashboardTierAV1PresetCoversBridge()).toEqual([]);
    expect(DASHBOARD_DEFAULT_LAYOUT_PRESET.items.length).toBeGreaterThan(0);
  });
});
