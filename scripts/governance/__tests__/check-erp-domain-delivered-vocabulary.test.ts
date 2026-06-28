import { describe, expect, it } from "vitest";

import {
  checkDeliveredModuleContracts,
  checkErpDomainDeliveredVocabulary,
  findForbiddenImportViolations,
  findRuntimeServiceSurfaceViolations,
  formatErpDomainDeliveredVocabularyViolations,
} from "../check-erp-domain-delivered-vocabulary.mts";
import {
  ERP_DOMAIN_DELIVERED_VOCABULARY_GATE_COMMAND,
  ERP_DOMAIN_DELIVERED_VOCABULARY_SURFACE_RULE,
} from "../erp-domain-delivered-vocabulary-registry.mts";

describe("check-erp-domain-delivered-vocabulary gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkErpDomainDeliveredVocabulary();

    expect(
      violations,
      formatErpDomainDeliveredVocabularyViolations(violations)
    ).toEqual([]);
  });

  it("exports the unified contracts-only surface rule", () => {
    expect(ERP_DOMAIN_DELIVERED_VOCABULARY_SURFACE_RULE).toBe(
      "erp-domain-delivered-vocabulary-contracts-only"
    );
    expect(ERP_DOMAIN_DELIVERED_VOCABULARY_GATE_COMMAND).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });

  it("validates delivered procurement module contracts", () => {
    const violations = checkDeliveredModuleContracts("procurement");

    expect(violations).toEqual([]);
  });

  it("detects forbidden Drizzle imports (negative contract)", () => {
    const violations = findForbiddenImportViolations(
      'import { pgTable } from "drizzle-orm/pg-core";',
      "packages/kernel/src/erp-domain/controlling/bad.ts"
    );

    expect(violations.map((entry) => entry.rule)).toContain("forbidden-import");
  });

  it("detects prohibited runtime surfaces in server files", () => {
    const violations = findRuntimeServiceSurfaceViolations(
      "export async function postJournalEntry() {}",
      "posting.server.ts",
      "packages/kernel/src/erp-domain/tax/posting.server.ts"
    );

    expect(violations.map((entry) => entry.rule)).toContain(
      "runtime-service-surface"
    );
  });
});
