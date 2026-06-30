import {
  createTestEnterpriseId,
  parseCompanyId,
  parseTenantId,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import { detectAuthorityPrecedenceConflicts } from "../policy/conflict-precedence.policy.js";
import { validatePostingAgainstAccountingStandards } from "../rules/posting-validation-engine.js";
import { getAccountingStandardVersionRef } from "../standards/standard-version.registry.js";

const tenantId = parseTenantId(createTestEnterpriseId("tenant"));
const companyId = parseCompanyId(createTestEnterpriseId("company"));

describe("conflict precedence policy (B19)", () => {
  it("detects company policy overriding mandatory standard", () => {
    const standard = getAccountingStandardVersionRef("IFRS_18_REQUIRED_2026");
    const policy = getAccountingStandardVersionRef(
      "IFRS_18_GROUP_PRESENTATION_POLICY"
    );
    expect(standard).toBeDefined();
    expect(policy).toBeDefined();
    if (!(standard && policy)) {
      return;
    }

    const conflicts = detectAuthorityPrecedenceConflicts([standard, policy]);
    expect(conflicts.length).toBe(1);
    expect(conflicts[0]?.lowerPrecedenceSource).toBe("company_policy");
  });

  it("emits precedence conflict results in validation report", () => {
    const report = validatePostingAgainstAccountingStandards({
      tenantId,
      companyId,
      eventType: "financial_statement_presentation",
      accountingStandardFamily: "IFRS",
      transactionFacts: {},
      postingDraft: null,
    });

    expect(report.precedenceConflictDetected).toBe(true);
    expect(
      report.results.some(
        (result) => result.ruleId === "PRECEDENCE-CONFLICT-001"
      )
    ).toBe(true);
  });
});
