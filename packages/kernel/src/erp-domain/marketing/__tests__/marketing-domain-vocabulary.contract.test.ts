import { describe, expect, it } from "vitest";

import {
  type assertMarketingDomainVocabularyRegistryIntegrity,
  isAttributionModel,
  isCampaignChannel,
  isCampaignStatus,
  isMarketingAuditAction,
  isSegmentType,
  MARKETING_AUDIT_ACTIONS,
  MARKETING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  MARKETING_DOMAIN_CLOSED_VOCABULARIES,
  MARKETING_DOMAIN_VOCABULARY_POLICY,
  MARKETING_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B marketing domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(MARKETING_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-MARKETING"
    );
  });

  it("lists closed vocabularies", () => {
    expect(MARKETING_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(MARKETING_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(MARKETING_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertMarketingDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isMarketingAuditAction(MARKETING_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isCampaignStatus("draft")).toBe(true);
    expect(isCampaignChannel("email")).toBe(true);
    expect(isSegmentType("static")).toBe(true);
    expect(isAttributionModel("first_touch")).toBe(true);
  });
});

describe("PAS-001B marketing domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(MARKETING_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
