import {
  createTestEnterpriseId,
  parseCompanyId,
  parseTenantId,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import {
  normalizeCountryCodeToJurisdiction,
  resolveJurisdictionProcessRoute,
} from "../routing/jurisdiction-profile.registry.js";
import { validatePostingAgainstAccountingStandards } from "../rules/posting-validation-engine.js";

const tenantId = parseTenantId(createTestEnterpriseId("tenant"));
const companyId = parseCompanyId(createTestEnterpriseId("company"));

describe("jurisdiction profile routing (B18)", () => {
  it("normalizes country codes to jurisdiction profiles", () => {
    expect(normalizeCountryCodeToJurisdiction("MY")).toBe("MY");
    expect(normalizeCountryCodeToJurisdiction("sg")).toBe("SG");
    expect(normalizeCountryCodeToJurisdiction("DE")).toBe("EU");
  });

  it("adds jurisdiction statutory routes for MY lease events", () => {
    expect(
      resolveJurisdictionProcessRoute(
        "MY",
        "statutory",
        "lease_contract_recognition"
      )
    ).toContain("LOCAL_POLICY_REVIEW");
  });

  it("marks jurisdiction family mismatch as requires_review", () => {
    const report = validatePostingAgainstAccountingStandards({
      tenantId,
      companyId,
      eventType: "lease_contract_recognition",
      accountingStandardFamily: "IFRS",
      jurisdictionCode: "MY",
      transactionFacts: { leaseTermMonths: 24 },
      postingDraft: null,
    });

    expect(report.jurisdictionCode).toBe("MY");
    expect(report.scopeGateStatus).toBe("requires_review");
    expect(report.routedStandardKeys).toContain("LOCAL_POLICY_REVIEW");
  });
});
