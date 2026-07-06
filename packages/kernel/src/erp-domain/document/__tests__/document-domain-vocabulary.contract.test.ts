import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertDocumentDomainVocabularyRegistryIntegrity,
  DOCUMENT_AUDIT_ACTIONS,
  DOCUMENT_DOMAIN_AUDIT_VOCABULARY,
  DOCUMENT_DOMAIN_BRANDED_ID_TYPE_NAMES,
  DOCUMENT_DOMAIN_CLOSED_VOCABULARIES,
  DOCUMENT_DOMAIN_PERMISSION_VOCABULARY,
  DOCUMENT_DOMAIN_VOCABULARY_POLICY,
  DOCUMENT_DOMAIN_VOCABULARY_REGISTRY,
  DOCUMENT_DOMAIN_VOCABULARY_REGISTRY_ID,
  isAttachmentRole,
  isDocumentAuditAction,
  isDocumentClass,
  isDocumentLifecycleStatus,
  isRetentionPolicy,
} from "../index.js";

describe("PAS-001B document domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: DOCUMENT_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: DOCUMENT_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "document-class",
        "retention-policy",
        "document-lifecycle-status",
        "attachment-role",
      ],
      brandedIdTypeNames: DOCUMENT_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: DOCUMENT_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: DOCUMENT_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(DOCUMENT_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-DOCUMENT"
    );
  });

  it("lists closed vocabularies", () => {
    expect(DOCUMENT_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(DOCUMENT_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(DOCUMENT_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertDocumentDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isDocumentAuditAction(DOCUMENT_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isDocumentClass("invoice")).toBe(true);
    expect(isRetentionPolicy("standard")).toBe(true);
    expect(isDocumentLifecycleStatus("draft")).toBe(true);
    expect(isAttachmentRole("supporting")).toBe(true);
  });
});

describe("PAS-001B document domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(DOCUMENT_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
