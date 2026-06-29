import {
  createTestEnterpriseId,
  parseCompanyId,
  parseTenantId,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import { validatePostingAgainstAccountingStandards } from "../rules/posting-validation-engine.js";
import { IFRS_16_LEASE_WARNING_MESSAGE } from "../standards/ifrs/ifrs-16-leases.registry.js";

const tenantId = parseTenantId(createTestEnterpriseId("tenant"));
const companyId = parseCompanyId(createTestEnterpriseId("company"));

describe("IFRS 16 lease posting validation proof (B9)", () => {
  it("warns when a qualifying lease is posted as simple rent expense only", () => {
    const report = validatePostingAgainstAccountingStandards({
      tenantId,
      companyId,
      eventType: "lease_contract_recognition",
      accountingStandardFamily: "IFRS",
      transactionFacts: {
        leaseTermMonths: 36,
        isLowValue: false,
      },
      postingDraft: {
        debitAccountKeys: ["rent_expense"],
        creditAccountKeys: ["cash"],
        amountCurrency: "USD",
      },
    });

    expect(report.aggregateStatus).toBe("warning");
    expect(report.routedStandardKeys).toContain("IFRS_16");

    const warning = report.results.find(
      (result) => result.status === "warning"
    );
    expect(warning).toBeDefined();
    expect(warning?.ruleId).toBe("IFRS16-LEASE-LESSEE-ROU-LIABILITY-001");
    expect(warning?.standardCode).toBe("IFRS 16");
    expect(warning?.message).toBe(IFRS_16_LEASE_WARNING_MESSAGE);
    expect(warning?.evidenceSnapshot?.explanationKey).toBe(
      "ifrs16-lessee-rou-liability-warning"
    );
    expect(warning?.scopeGateStatus).toBe("in_scope");
  });

  it("passes when lease term is 12 months or less", () => {
    const report = validatePostingAgainstAccountingStandards({
      tenantId,
      companyId,
      eventType: "lease_contract_recognition",
      accountingStandardFamily: "IFRS",
      transactionFacts: {
        leaseTermMonths: 11,
        isLowValue: false,
      },
      postingDraft: {
        debitAccountKeys: ["rent_expense"],
        creditAccountKeys: ["cash"],
        amountCurrency: "USD",
      },
    });

    expect(report.aggregateStatus).toBe("info");
    expect(
      report.results.some(
        (result) => result.ruleId === "IFRS16-LEASE-SHORT-TERM-EXEMPTION-001"
      )
    ).toBe(true);
  });

  it("passes ROU recognition path when lease accounts are present", () => {
    const report = validatePostingAgainstAccountingStandards({
      tenantId,
      companyId,
      eventType: "lease_contract_recognition",
      accountingStandardFamily: "IFRS",
      transactionFacts: {
        leaseTermMonths: 36,
        isLowValue: false,
      },
      postingDraft: {
        debitAccountKeys: ["right_of_use_asset"],
        creditAccountKeys: ["lease_liability"],
        amountCurrency: "USD",
      },
    });

    expect(report.results.every((result) => result.status !== "warning")).toBe(
      true
    );
  });

  it("escalates judgment for minority investment with local policy routing (B14)", () => {
    const report = validatePostingAgainstAccountingStandards({
      tenantId,
      companyId,
      eventType: "holding_relationship_minority_investment",
      accountingStandardFamily: "IFRS",
      transactionFacts: {},
      postingDraft: null,
    });

    expect(report.judgmentEscalationRequired).toBe(true);
    expect(report.scopeGateStatus).toBe("requires_review");
  });
});
