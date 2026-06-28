import { describe, expect, it } from "vitest";

import {
  type assertPricingDomainVocabularyRegistryIntegrity,
  isDiscountType,
  isPriceApprovalStatus,
  isPriceListStatus,
  isPricingAuditAction,
  isPricingMethod,
  PRICING_AUDIT_ACTIONS,
  PRICING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  PRICING_DOMAIN_CLOSED_VOCABULARIES,
  PRICING_DOMAIN_VOCABULARY_POLICY,
  PRICING_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B pricing domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(PRICING_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-PRICING");
  });

  it("lists closed vocabularies", () => {
    expect(PRICING_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(PRICING_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(PRICING_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertPricingDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isPricingAuditAction(PRICING_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isPriceListStatus("draft")).toBe(true);
    expect(isPricingMethod("cost_plus")).toBe(true);
    expect(isDiscountType("percent")).toBe(true);
    expect(isPriceApprovalStatus("pending")).toBe(true);
  });
});

describe("PAS-001B pricing domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(PRICING_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
