import { describe, expect, it } from "vitest";
import {
  checkInventoryDomainContracts,
  findForbiddenImportViolations,
  findStockServiceSurfaceViolations,
  formatInventoryDomainContractsViolations,
} from "../check-inventory-domain-contracts.mts";
import {
  INVENTORY_DOMAIN_CONTRACTS_EVIDENCE,
  INVENTORY_DOMAIN_CONTRACTS_SURFACE_RULE,
  INVENTORY_FORBIDDEN_RELATIVE_DIRS,
  INVENTORY_RETIRED_PACKAGE_ROOT,
} from "../inventory-domain-contracts-registry.mts";

describe("check-inventory-domain-contracts gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkInventoryDomainContracts();

    expect(
      violations,
      formatInventoryDomainContractsViolations(violations)
    ).toEqual([]);
  });

  it("exports the contracts-only surface rule", () => {
    expect(INVENTORY_DOMAIN_CONTRACTS_SURFACE_RULE).toBe(
      "inventory-domain-contracts-only-no-runtime-posting"
    );
  });

  it("lists PKGR02 evidence paths including kernel erp-domain inventory surface", () => {
    expect(INVENTORY_DOMAIN_CONTRACTS_EVIDENCE).toContain(
      "packages/kernel/src/erp-domain/inventory/index.ts"
    );
    expect(INVENTORY_DOMAIN_CONTRACTS_EVIDENCE).toContain(
      "scripts/governance/check-inventory-domain-contracts.mts"
    );
  });

  it("flags retired packages/inventory and forbidden kernel runtime dirs", () => {
    expect(INVENTORY_FORBIDDEN_RELATIVE_DIRS).toContain(
      INVENTORY_RETIRED_PACKAGE_ROOT
    );
    expect(INVENTORY_FORBIDDEN_RELATIVE_DIRS).toContain(
      "packages/kernel/src/erp-domain/inventory/schema"
    );
  });

  it("detects forbidden Drizzle and database imports (negative contract)", () => {
    const drizzleViolation = findForbiddenImportViolations(
      'import { pgTable } from "drizzle-orm/pg-core";',
      "packages/kernel/src/erp-domain/inventory/bad.ts"
    );

    expect(drizzleViolation.map((entry) => entry.rule)).toContain(
      "forbidden-import"
    );
  });

  it("detects prohibited stock service surfaces in server files", () => {
    const violations = findStockServiceSurfaceViolations(
      "export async function postStockMovement() {}",
      "posting.server.ts",
      "packages/kernel/src/erp-domain/inventory/posting.server.ts"
    );

    expect(violations.map((entry) => entry.rule)).toContain(
      "stock-service-surface"
    );
  });
});
