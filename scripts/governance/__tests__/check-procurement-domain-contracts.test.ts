import { describe, expect, it } from "vitest";

import {
  checkProcurementDomainContracts,
  findForbiddenImportViolations,
  findPostingServiceSurfaceViolations,
  formatProcurementDomainContractsViolations,
} from "../check-procurement-domain-contracts.mts";
import {
  PROCUREMENT_CONTRACTS_ROOT,
  PROCUREMENT_DOMAIN_CONTRACTS_EVIDENCE,
  PROCUREMENT_DOMAIN_CONTRACTS_SURFACE_RULE,
  PROCUREMENT_FORBIDDEN_RELATIVE_DIRS,
} from "../procurement-domain-contracts-registry.mts";

describe("check-procurement-domain-contracts gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkProcurementDomainContracts();

    expect(
      violations,
      formatProcurementDomainContractsViolations(violations)
    ).toEqual([]);
  });

  it("exports the contracts-only surface rule", () => {
    expect(PROCUREMENT_DOMAIN_CONTRACTS_SURFACE_RULE).toBe(
      "procurement-domain-contracts-only-no-runtime-posting"
    );
  });

  it("lists PAS-001B evidence paths including kernel erp-domain procurement surface", () => {
    expect(PROCUREMENT_DOMAIN_CONTRACTS_EVIDENCE).toContain(
      "packages/kernel/src/erp-domain/procurement/index.ts"
    );
    expect(PROCUREMENT_DOMAIN_CONTRACTS_EVIDENCE).toContain(
      "scripts/governance/check-procurement-domain-contracts.mts"
    );
  });

  it("flags forbidden packages/procurement and kernel runtime dirs", () => {
    expect(PROCUREMENT_FORBIDDEN_RELATIVE_DIRS).toContain(
      "packages/procurement"
    );
    expect(PROCUREMENT_FORBIDDEN_RELATIVE_DIRS).toContain(
      "packages/kernel/src/erp-domain/procurement/schema"
    );
    expect(PROCUREMENT_CONTRACTS_ROOT).toBe(
      "packages/kernel/src/erp-domain/procurement"
    );
  });

  it("detects forbidden Drizzle and database imports (negative contract)", () => {
    const drizzleViolation = findForbiddenImportViolations(
      'import { pgTable } from "drizzle-orm/pg-core";',
      "packages/kernel/src/erp-domain/procurement/bad.ts"
    );

    expect(drizzleViolation.map((entry) => entry.rule)).toContain(
      "forbidden-import"
    );
  });

  it("detects prohibited posting surfaces in server files", () => {
    const violations = findPostingServiceSurfaceViolations(
      "export async function postPurchaseOrder() {}",
      "posting.server.ts",
      "packages/kernel/src/erp-domain/procurement/posting.server.ts"
    );

    expect(violations.map((entry) => entry.rule)).toContain(
      "posting-service-surface"
    );
  });
});
