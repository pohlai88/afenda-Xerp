import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertHcmDomainVocabularyRegistryIntegrity,
  HCM_AUDIT_ACTIONS,
  HCM_DOMAIN_AUDIT_VOCABULARY,
  HCM_DOMAIN_BRANDED_ID_TYPE_NAMES,
  HCM_DOMAIN_CLOSED_VOCABULARIES,
  HCM_DOMAIN_PERMISSION_VOCABULARY,
  HCM_DOMAIN_VOCABULARY_POLICY,
  HCM_DOMAIN_VOCABULARY_REGISTRY,
  HCM_DOMAIN_VOCABULARY_REGISTRY_ID,
  isEmploymentType,
  isHcmAuditAction,
  isOnboardingStep,
  isRequisitionStatus,
  isReviewCycleStatus,
} from "../index.js";

describe("PAS-001B hcm domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: HCM_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: HCM_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "requisition-status",
        "employment-type",
        "review-cycle-status",
        "onboarding-step",
      ],
      brandedIdTypeNames: HCM_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: HCM_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: HCM_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

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
