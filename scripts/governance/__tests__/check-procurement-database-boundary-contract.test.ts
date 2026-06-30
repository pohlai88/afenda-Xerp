import { describe, expect, it } from "vitest";

import { PROCUREMENT_DATABASE_BOUNDARY_CONTRACT } from "../../../packages/features/erp-modules/src/procurement/procurement.database-boundary.contract.ts";
import { checkProcurementDatabaseBoundaryContract } from "../check-procurement-database-boundary-contract.mts";

describe("check-procurement-database-boundary-contract gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkProcurementDatabaseBoundaryContract();

    expect(violations).toEqual([]);
  });

  it("declares four deferred planned tables", () => {
    expect(PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.tables).toHaveLength(4);

    for (const table of PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.tables) {
      expect(table.migrationStatus).toBe("deferred");
    }
  });
});
