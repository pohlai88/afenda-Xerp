import {
  createTestEnterpriseId,
  parseCompanyId,
  parseTenantId,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import { validateAccountingStandardRuleEvidence } from "../policy/rule-evidence.policy.js";
import { validateAccountingStandardVersionRegistry } from "../policy/version-registry.policy.js";
import { validatePostingAgainstAccountingStandards } from "../rules/posting-validation-engine.js";
import { ACCOUNTING_STANDARD_POSTING_RULES } from "../rules/posting-validation-rule.registry.js";

describe("accounting standards policy conformance", () => {
  it("validates version registry integrity", () => {
    expect(validateAccountingStandardVersionRegistry()).toEqual([]);
  });

  it("validates rule evidence integrity", () => {
    expect(validateAccountingStandardRuleEvidence()).toEqual([]);
  });

  it("registers at least one rule per IFRS standard pack", () => {
    expect(ACCOUNTING_STANDARD_POSTING_RULES.length).toBeGreaterThanOrEqual(14);
  });

  it("returns deterministic reports for identical input", () => {
    const input = {
      tenantId: parseTenantId(createTestEnterpriseId("tenant")),
      companyId: parseCompanyId(createTestEnterpriseId("company")),
      eventType: "lease_contract_recognition",
      accountingStandardFamily: "IFRS" as const,
      transactionFacts: { leaseTermMonths: 24, isLowValue: false },
      postingDraft: {
        debitAccountKeys: ["rent_expense"],
        creditAccountKeys: ["cash"],
        amountCurrency: "USD",
      },
    };

    const first = validatePostingAgainstAccountingStandards(input);
    const second = validatePostingAgainstAccountingStandards(input);

    expect(first).toEqual(second);
  });
});
