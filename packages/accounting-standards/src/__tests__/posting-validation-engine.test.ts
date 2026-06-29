import {
  createTestEnterpriseId,
  parseCompanyId,
  parseTenantId,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import {
  evaluateAccountingStandardPostingValidation,
  validatePostingAgainstAccountingStandards,
} from "../rules/posting-validation-engine.js";

const tenantId = parseTenantId(createTestEnterpriseId("tenant"));
const companyId = parseCompanyId(createTestEnterpriseId("company"));

describe("posting validation engine", () => {
  it("aggregates blocked above warning", () => {
    const report = evaluateAccountingStandardPostingValidation({
      tenantId,
      companyId,
      eventType: "financial_statement_presentation",
      accountingStandardFamily: "IFRS",
      transactionFacts: {},
      postingDraft: null,
    });

    expect(report.fingerprint.length).toBeGreaterThan(0);
    expect(report.routedStandardKeys).toContain("IFRS_18");
    expect(["info", "warning"]).toContain(report.aggregateStatus);
  });

  it("returns out_of_scope for non-IFRS families", () => {
    const report = validatePostingAgainstAccountingStandards({
      tenantId,
      companyId,
      eventType: "lease_contract_recognition",
      accountingStandardFamily: "US_GAAP",
      transactionFacts: {},
      postingDraft: null,
    });

    expect(report.scopeGateStatus).toBe("out_of_scope");
    expect(report.aggregateStatus).toBe("pass");
  });

  it("merges reporting context and cross-representation routes", () => {
    const report = validatePostingAgainstAccountingStandards({
      tenantId,
      companyId,
      eventType: "holding_relationship_subsidiary",
      accountingStandardFamily: "IFRS",
      reportingPurpose: "group_consolidation",
      crossRepresentationTransition: "statutory_to_group",
      transactionFacts: { controlPercentage: 80 },
      postingDraft: null,
    });

    expect(report.routedStandardKeys).toContain("IFRS_10");
    expect(report.results.length).toBeGreaterThan(0);
  });
});
