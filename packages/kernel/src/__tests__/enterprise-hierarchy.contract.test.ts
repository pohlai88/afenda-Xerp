import { describe, expect, it } from "vitest";

import {
  compareEnterpriseHierarchyTierOrder,
  ENTERPRISE_HIERARCHY_TIERS,
  isEnterpriseHierarchyTier,
  parseSurfaceId,
  parseWorkflowId,
  toSurfaceContext,
  toWorkflowContext,
} from "../context/index.js";

describe("enterprise hierarchy contract", () => {
  it("defines the canonical tier order from multi-tenancy architecture", () => {
    expect(ENTERPRISE_HIERARCHY_TIERS).toEqual([
      "tenant",
      "entity_group",
      "legal_entity",
      "ownership_interest",
      "organization_unit",
      "team",
      "project",
      "workspace",
      "surface",
      "workflow",
    ]);
    expect(
      compareEnterpriseHierarchyTierOrder("tenant", "legal_entity")
    ).toBeLessThan(0);
    expect(
      compareEnterpriseHierarchyTierOrder("workspace", "surface")
    ).toBeLessThan(0);
    expect(isEnterpriseHierarchyTier("organization_unit")).toBe(true);
    expect(isEnterpriseHierarchyTier("organization")).toBe(false);
  });

  it("validates runtime surface and workflow identifiers", () => {
    expect(parseSurfaceId("accounting.journal.list")).toBe(
      "accounting.journal.list"
    );
    expect(parseSurfaceId("page/sample/orders")).toBe("page.sample.orders");
    expect(parseSurfaceId("page-sample-orders")).toBe("page.sample.orders");
    expect(parseSurfaceId("Invalid Surface")).toBe("invalid.surface");
    expect(parseSurfaceId("!!!")).toBeNull();
    expect(toSurfaceContext("inventory.warehouse.detail")).toEqual({
      surfaceId: "inventory.warehouse.detail",
    });

    expect(parseWorkflowId("procurement.approval.review")).toBe(
      "procurement.approval.review"
    );
    expect(parseWorkflowId("procurement/approval/review")).toBe(
      "procurement.approval.review"
    );
    expect(
      toWorkflowContext({
        workflowId: "procurement.approval.review",
        surfaceId: "procurement.po.detail",
      })
    ).toEqual({
      workflowId: "procurement.approval.review",
      surfaceId: "procurement.po.detail",
    });
  });
});
