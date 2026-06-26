import { describe, expect, it } from "vitest";

import {
  assertSharedPackageOwnershipPolicy,
  getEntitiesForReservedPackage,
  INVENTORY_PERSISTENCE_ENTITY_IDS,
  INVENTORY_PERSISTENCE_PACKAGE_ID,
  summarizePackageOwnership,
} from "../contracts/business-master-data/index.js";

describe("@afenda/kernel business master data persistence ownership (ADR-0020)", () => {
  it("assigns product and warehouse persistence to @afenda/database", () => {
    const persistenceEntities = getEntitiesForReservedPackage(
      INVENTORY_PERSISTENCE_PACKAGE_ID
    );

    expect(persistenceEntities).toEqual([...INVENTORY_PERSISTENCE_ENTITY_IDS]);
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
    expect(
      summaries.find(
        (summary) => summary.reservedPackageId === "@afenda/database"
      )?.entityIds
    ).toEqual(["product", "warehouse"]);
  });
});
