import { describe, expect, it } from "vitest";

import {
  ACCOUNTING_DOMAIN_CONTRACTS_EVIDENCE,
  ACCOUNTING_DOMAIN_CONTRACTS_SURFACE_RULE,
  ACCOUNTING_ERP_FORBIDDEN_ROUTE_DIRS,
  ACCOUNTING_FORBIDDEN_RELATIVE_DIRS,
} from "../accounting-domain-contracts-registry.mts";
import {
  checkAccountingDomainContracts,
  checkErpAccountingSurfaceDrift,
  findForbiddenImportViolations,
  findPostingServiceSurfaceViolations,
  formatAccountingDomainContractsViolations,
} from "../check-accounting-domain-contracts.mts";

describe("check-accounting-domain-contracts gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkAccountingDomainContracts();

    expect(
      violations,
      formatAccountingDomainContractsViolations(violations)
    ).toEqual([]);
  });

  it("exports the contracts-only surface rule", () => {
    expect(ACCOUNTING_DOMAIN_CONTRACTS_SURFACE_RULE).toBe(
      "accounting-domain-contracts-only-no-runtime-posting"
    );
  });

  it("lists PKG-R01 evidence paths including kernel erp-domain accounting surface", () => {
    expect(ACCOUNTING_DOMAIN_CONTRACTS_EVIDENCE).toContain(
      "packages/kernel/src/erp-domain/accounting/index.ts"
    );
    expect(ACCOUNTING_DOMAIN_CONTRACTS_EVIDENCE).toContain(
      "scripts/governance/check-accounting-domain-contracts.mts"
    );
  });

  it("flags retired packages/accounting and forbidden kernel runtime dirs", () => {
    expect(ACCOUNTING_FORBIDDEN_RELATIVE_DIRS).toContain("packages/accounting");
    expect(ACCOUNTING_FORBIDDEN_RELATIVE_DIRS).toContain(
      "packages/kernel/src/erp-domain/accounting/schema"
    );
  });

  it("detects forbidden Drizzle and database imports (negative contract)", () => {
    const drizzleViolation = findForbiddenImportViolations(
      'import { pgTable } from "drizzle-orm/pg-core";',
      "packages/accounting/src/schema/accounts.ts"
    );
    const databaseViolation = findForbiddenImportViolations(
      'import { accounts } from "@afenda/database";',
      "packages/accounting/src/contracts/bad.contract.ts"
    );

    expect(drizzleViolation.map((entry) => entry.rule)).toContain(
      "forbidden-import"
    );
    expect(databaseViolation.map((entry) => entry.rule)).toContain(
      "forbidden-import"
    );
  });

  it("does not false-positive on bridge vocabulary without forbidden imports", () => {
    const bridgeSource = `
      export function toAccountingDomainContext(readiness: AccountingReadinessContext) {
        return { tenantId: readiness.legalEntity.tenantId };
      }
    `;

    expect(
      findForbiddenImportViolations(
        bridgeSource,
        "packages/accounting/src/bridge/to-accounting-domain-context.ts"
      )
    ).toEqual([]);
  });

  it("flags posting keywords only in .server.ts surfaces", () => {
    const benignServerSource = `
      export async function resolveOperatingContext() {
        return { kind: "ready" as const };
      }
    `;
    const postingServerSource = `
      export async function postJournalEntry() {
        return { ok: true };
      }
    `;

    expect(
      findPostingServiceSurfaceViolations(
        benignServerSource,
        "resolve-operating-context.server.ts",
        "apps/erp/src/lib/context/resolve-operating-context.server.ts"
      )
    ).toEqual([]);

    const postingViolations = findPostingServiceSurfaceViolations(
      postingServerSource,
      "posting.server.ts",
      "packages/accounting/src/services/posting.server.ts"
    );

    expect(postingViolations.map((entry) => entry.rule)).toContain(
      "posting-service-surface"
    );
  });

  it("does not apply posting keyword scan to non-.server.ts files", () => {
    const violations = findPostingServiceSurfaceViolations(
      "export const postJournalEntry = 'vocabulary-only';",
      "journal-document-type.contract.ts",
      "packages/accounting/src/contracts/journal-document-type.contract.ts"
    );

    expect(violations).toEqual([]);
  });

  it("blocks dedicated ERP accounting route directories until TIP-015+", () => {
    expect(ACCOUNTING_ERP_FORBIDDEN_ROUTE_DIRS).toContain(
      "apps/erp/src/app/(protected)/modules/accounting"
    );

    const erpViolations = checkErpAccountingSurfaceDrift();
    expect(erpViolations.map((entry) => entry.rule)).not.toContain(
      "erp-accounting-route-drift"
    );
    expect(erpViolations.map((entry) => entry.rule)).not.toContain(
      "erp-accounting-import-drift"
    );
  });
});
