import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertCrmDomainVocabularyRegistryIntegrity,
  CRM_AUDIT_ACTIONS,
  CRM_DOMAIN_AUDIT_VOCABULARY,
  CRM_DOMAIN_BRANDED_ID_TYPE_NAMES,
  CRM_DOMAIN_CLOSED_VOCABULARIES,
  CRM_DOMAIN_PERMISSION_VOCABULARY,
  CRM_DOMAIN_VOCABULARY_POLICY,
  CRM_DOMAIN_VOCABULARY_REGISTRY,
  CRM_DOMAIN_VOCABULARY_REGISTRY_ID,
  isAccountTier,
  isActivityType,
  isCrmAuditAction,
  isLeadStatus,
  isOpportunityStage,
} from "../index.js";

describe("PAS-001B crm domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: CRM_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: CRM_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "lead-status",
        "opportunity-stage",
        "activity-type",
        "account-tier",
      ],
      brandedIdTypeNames: CRM_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: CRM_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: CRM_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(CRM_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-CRM");
  });

  it("lists closed vocabularies", () => {
    expect(CRM_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(CRM_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(CRM_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertCrmDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isCrmAuditAction(CRM_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isLeadStatus("new")).toBe(true);
    expect(isOpportunityStage("prospect")).toBe(true);
    expect(isActivityType("call")).toBe(true);
    expect(isAccountTier("standard")).toBe(true);
  });
});

describe("PAS-001B crm domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(CRM_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
