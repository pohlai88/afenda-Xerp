import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertServiceDomainVocabularyRegistryIntegrity,
  isCasePriority,
  isCaseStatus,
  isResolutionType,
  isServiceAuditAction,
  isServiceLevel,
  SERVICE_AUDIT_ACTIONS,
  SERVICE_DOMAIN_AUDIT_VOCABULARY,
  SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SERVICE_DOMAIN_CLOSED_VOCABULARIES,
  SERVICE_DOMAIN_PERMISSION_VOCABULARY,
  SERVICE_DOMAIN_VOCABULARY_POLICY,
  SERVICE_DOMAIN_VOCABULARY_REGISTRY,
  SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B service domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: SERVICE_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "case-status",
        "case-priority",
        "service-level",
        "resolution-type",
      ],
      brandedIdTypeNames: SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: SERVICE_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: SERVICE_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-SERVICE");
  });

  it("lists closed vocabularies", () => {
    expect(SERVICE_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertServiceDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isServiceAuditAction(SERVICE_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isCaseStatus("new")).toBe(true);
    expect(isCasePriority("low")).toBe(true);
    expect(isServiceLevel("basic")).toBe(true);
    expect(isResolutionType("fixed")).toBe(true);
  });
});

describe("PAS-001B service domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(SERVICE_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
