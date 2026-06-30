import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  PROCUREMENT_DATABASE_BOUNDARY_ATTESTATION,
  PROCUREMENT_DATABASE_BOUNDARY_CONTRACT,
  PROCUREMENT_DATABASE_BOUNDARY_SLICE_ID,
  PROCUREMENT_DATABASE_BOUNDARY_STATUS,
} from "../procurement.database-boundary.contract.js";
import { PROCUREMENT_OWNERSHIP_CONTRACT } from "../procurement.ownership.contract.js";

const REPO_ROOT = join(import.meta.dirname, "../../../../../../");

describe("procurement.database-boundary.contract (ERP-PROC-OP-003)", () => {
  it("declares ERP-PROC-OP-003 declared attestation", () => {
    expect(PROCUREMENT_DATABASE_BOUNDARY_SLICE_ID).toBe("ERP-PROC-OP-003");
    expect(PROCUREMENT_DATABASE_BOUNDARY_STATUS).toBe("declared");
    expect(PROCUREMENT_DATABASE_BOUNDARY_ATTESTATION.sliceId).toBe(
      "ERP-PROC-OP-003"
    );
    expect(PROCUREMENT_DATABASE_BOUNDARY_ATTESTATION.status).toBe("declared");
    expect(
      PROCUREMENT_DATABASE_BOUNDARY_ATTESTATION.migrationsProhibitedUntil
    ).toContain("RLS ADR");
  });

  it("matches ownership contract schemaOwner on @afenda/database", () => {
    expect(PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.schemaOwner).toBe(
      PROCUREMENT_OWNERSHIP_CONTRACT.databaseSchema
    );
    expect(PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.schemaOwner).toBe(
      "@afenda/database"
    );
  });

  it("plans four deferred tables with documented schema paths only", () => {
    expect(PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.tables).toHaveLength(4);
    expect(
      PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.tables.map(
        (table) => table.tableName
      )
    ).toEqual([
      "suppliers",
      "purchase_requisitions",
      "purchase_orders",
      "procurement_rfqs",
    ]);

    for (const table of PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.tables) {
      expect(table.tenantScoped).toBe(true);
      expect(table.migrationStatus).toBe("deferred");
      expect(table.plannedSchemaPath.startsWith("packages/database/")).toBe(
        true
      );
      expect(existsSync(join(REPO_ROOT, table.plannedSchemaPath))).toBe(false);
    }
  });
});
