import { describe, expect, it } from "vitest";

import {
  type assertHcmDomainVocabularyRegistryIntegrity,
  HCM_AUDIT_ACTIONS,
  HCM_DOMAIN_BRANDED_ID_TYPE_NAMES,
  HCM_DOMAIN_CLOSED_VOCABULARIES,
  HCM_DOMAIN_VOCABULARY_POLICY,
  HCM_DOMAIN_VOCABULARY_REGISTRY_ID,
  isEmploymentType,
  isHcmAuditAction,
  isOnboardingStep,
  isRequisitionStatus,
  isReviewCycleStatus,
} from "../index.js";

describe("PAS-001B hcm domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(HCM_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-HCM");
  });

  it("lists closed vocabularies", () => {
    expect(HCM_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(HCM_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(HCM_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertHcmDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isHcmAuditAction(HCM_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isRequisitionStatus("draft")).toBe(true);
    expect(isEmploymentType("full_time")).toBe(true);
    expect(isReviewCycleStatus("planned")).toBe(true);
    expect(isOnboardingStep("offer")).toBe(true);
  });
});

describe("PAS-001B hcm domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(HCM_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
