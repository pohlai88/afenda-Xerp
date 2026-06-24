import { describe, expect, it } from "vitest";

import {
  assertSharedPackageOwnershipPolicy,
  getEntitiesForReservedPackage,
  INVENTORY_SHARED_ENTITY_IDS,
  INVENTORY_SHARED_PACKAGE_ID,
  summarizePackageOwnership,
} from "../contracts/business-master-data/index.js";

describe("@afenda/kernel business master data shared package policy (TIP-008B Slice 5)", () => {
  it("allows @afenda/inventory to own product and warehouse only", () => {
    const inventoryEntities = getEntitiesForReservedPackage(
      INVENTORY_SHARED_PACKAGE_ID
    );

    expect(inventoryEntities).toEqual([...INVENTORY_SHARED_ENTITY_IDS]);
    expect(() => assertSharedPackageOwnershipPolicy()).not.toThrow();
  });

  it("assigns exclusive ownership for CRM, HRM, and procurement packages", () => {
    const summaries = summarizePackageOwnership();

    expect(
      summaries.find((summary) => summary.reservedPackageId === "@afenda/crm")
        ?.entityIds
    ).toEqual(["customer"]);
    expect(
      summaries.find((summary) => summary.reservedPackageId === "@afenda/hrm")
        ?.entityIds
    ).toEqual(["employee"]);
    expect(
      summaries.find(
        (summary) => summary.reservedPackageId === "@afenda/procurement"
      )?.entityIds
    ).toEqual(["supplier"]);
  });
});
