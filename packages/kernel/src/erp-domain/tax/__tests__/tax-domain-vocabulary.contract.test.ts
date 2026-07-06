import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertTaxDomainVocabularyRegistryIntegrity,
  isTaxAuditAction,
  isTaxCalculationMethod,
  isTaxDocumentStatus,
  isTaxJurisdictionScope,
  isWithholdingType,
  TAX_AUDIT_ACTIONS,
  TAX_DOMAIN_AUDIT_VOCABULARY,
  TAX_DOMAIN_BRANDED_ID_TYPE_NAMES,
  TAX_DOMAIN_CLOSED_VOCABULARIES,
  TAX_DOMAIN_PERMISSION_VOCABULARY,
  TAX_DOMAIN_VOCABULARY_POLICY,
  TAX_DOMAIN_VOCABULARY_REGISTRY,
  TAX_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B tax domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: TAX_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: TAX_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "tax-jurisdiction-scope",
        "tax-calculation-method",
        "tax-document-status",
        "withholding-type",
      ],
      brandedIdTypeNames: TAX_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: TAX_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: TAX_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(TAX_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-TAX");
  });

  it("lists closed vocabularies", () => {
    expect(TAX_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(TAX_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(TAX_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertTaxDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isTaxAuditAction(TAX_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isTaxJurisdictionScope("domestic")).toBe(true);
    expect(isTaxCalculationMethod("standard")).toBe(true);
    expect(isTaxDocumentStatus("draft")).toBe(true);
    expect(isWithholdingType("income")).toBe(true);
  });
});

describe("PAS-001B tax domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(TAX_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
