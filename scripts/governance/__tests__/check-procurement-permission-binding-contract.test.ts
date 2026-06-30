import { describe, expect, it } from "vitest";

import { PROCUREMENT_PERMISSION_BINDING_CONTRACT } from "../../../packages/features/erp-modules/src/procurement/procurement.permission-binding.contract.ts";
import { checkProcurementPermissionBindingContract } from "../check-procurement-permission-binding-contract.mts";

describe("check-procurement-permission-binding-contract gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkProcurementPermissionBindingContract();

    expect(violations).toEqual([]);
  });

  it("declares eighteen deferred kernel permission keys", () => {
    expect(
      PROCUREMENT_PERMISSION_BINDING_CONTRACT.kernelPermissionKeys
    ).toHaveLength(18);
    expect(PROCUREMENT_PERMISSION_BINDING_CONTRACT.permissionParity).toBe(
      "deferred"
    );
    expect(PROCUREMENT_PERMISSION_BINDING_CONTRACT.registryWiringStatus).toBe(
      "deferred"
    );
  });
});
