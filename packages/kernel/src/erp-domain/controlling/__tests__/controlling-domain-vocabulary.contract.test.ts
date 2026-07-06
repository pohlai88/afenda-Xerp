import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertControllingDomainVocabularyRegistryIntegrity,
  CONTROLLING_AUDIT_ACTIONS,
  CONTROLLING_DOMAIN_AUDIT_VOCABULARY,
  CONTROLLING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  CONTROLLING_DOMAIN_CLOSED_VOCABULARIES,
  CONTROLLING_DOMAIN_PERMISSION_VOCABULARY,
  CONTROLLING_DOMAIN_VOCABULARY_POLICY,
  CONTROLLING_DOMAIN_VOCABULARY_REGISTRY,
  CONTROLLING_DOMAIN_VOCABULARY_REGISTRY_ID,
  isAllocationMethod,
  isControllingAuditAction,
  isControllingDocumentType,
  isCostElementCategory,
  isVarianceCategory,
} from "../index.js";

describe("PAS-001B controlling domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: CONTROLLING_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: CONTROLLING_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "cost-element-category",
        "allocation-method",
        "controlling-document-type",
        "variance-category",
      ],
      brandedIdTypeNames: CONTROLLING_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: CONTROLLING_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: CONTROLLING_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(CONTROLLING_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-CONTROLLING"
    );
  });

  it("lists closed vocabularies", () => {
    expect(CONTROLLING_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(CONTROLLING_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(CONTROLLING_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "CustomerId"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertControllingDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isControllingAuditAction(CONTROLLING_AUDIT_ACTIONS[0] ?? "")).toBe(
      true
    );
    expect(isCostElementCategory("primary")).toBe(true);
    expect(isAllocationMethod("direct")).toBe(true);
    expect(isControllingDocumentType("plan")).toBe(true);
    expect(isVarianceCategory("price")).toBe(true);
  });
});

describe("PAS-001B controlling domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(CONTROLLING_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
