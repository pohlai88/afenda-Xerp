import { describe, expect, it } from "vitest";

import {
  compareEnterpriseHierarchyTierOrder,
  ENTERPRISE_HIERARCHY_TIERS,
  isEnterpriseHierarchyTier,
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
});
