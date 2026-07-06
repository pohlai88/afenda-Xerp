import { describe, expect, it } from "vitest";

import {
  assertWorkflowManifestKindsAreCanonical,
  resolveWorkflowApprovalLayoutHint,
  resolveWorkflowTableLayoutHint,
} from "../workspace-board-manifest.bridge";
import { DASHBOARD_WIDGET_BRIDGE_REGISTRY } from "../dashboard-widget-bridge.registry";

describe("workspace-board-manifest.bridge", () => {
  it("consumes canonical workflow-table manifest kind for table layout hints", () => {
    const hint = resolveWorkflowTableLayoutHint();

    expect(hint).toEqual({ w: 12, h: 4, minW: 6, minH: 2 });
    expect(DASHBOARD_WIDGET_BRIDGE_REGISTRY["invoice-table"].defaultLayout).toEqual(
      hint
    );
  });

  it("consumes canonical workflow-approval manifest kind for form layout hints", () => {
    const hint = resolveWorkflowApprovalLayoutHint();

    expect(hint).toEqual({ w: 4, h: 3, minW: 3, minH: 2 });
  });

  it("asserts A-09 HOLD is lifted with host mapping wired to manifest kinds", () => {
    expect(assertWorkflowManifestKindsAreCanonical()).toEqual([]);
  });
});
