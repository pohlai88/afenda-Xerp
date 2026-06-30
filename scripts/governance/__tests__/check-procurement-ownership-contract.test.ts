import { describe, expect, it } from "vitest";
import { MODULE_OWNERSHIP_SURFACES } from "../../../packages/erp-module-foundation/src/erp-module-foundation.types.ts";
import { PROCUREMENT_FOUNDATION_BUNDLE } from "../../../packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts";
import { PROCUREMENT_OWNERSHIP_CONTRACT } from "../../../packages/features/erp-modules/src/procurement/procurement.ownership.contract.ts";
import { checkProcurementOwnershipContract } from "../check-procurement-ownership-contract.mts";

describe("check-procurement-ownership-contract gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkProcurementOwnershipContract();

    expect(violations).toEqual([]);
  });

  it("compares all eight MODULE_OWNERSHIP_SURFACES", () => {
    expect(MODULE_OWNERSHIP_SURFACES).toHaveLength(8);

    for (const surface of MODULE_OWNERSHIP_SURFACES) {
      expect(PROCUREMENT_OWNERSHIP_CONTRACT[surface]).toBe(
        PROCUREMENT_FOUNDATION_BUNDLE.ownership[surface]
      );
    }
  });
});
