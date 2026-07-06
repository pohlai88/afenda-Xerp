import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertConsolidationDomainVocabularyRegistryIntegrity,
  CONSOLIDATION_AUDIT_ACTIONS,
  CONSOLIDATION_DOMAIN_AUDIT_VOCABULARY,
  CONSOLIDATION_DOMAIN_BRANDED_ID_TYPE_NAMES,
  CONSOLIDATION_DOMAIN_CLOSED_VOCABULARIES,
  CONSOLIDATION_DOMAIN_PERMISSION_VOCABULARY,
  CONSOLIDATION_DOMAIN_VOCABULARY_POLICY,
  CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY,
  CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY_ID,
  isConsolidationAuditAction,
  isConsolidationRunStatus,
  isConsolidationScope,
  isEliminationType,
  isReportingCurrencyMethod,
} from "../index.js";

describe("PAS-001B consolidation domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "consolidation-scope",
        "elimination-type",
        "reporting-currency-method",
        "consolidation-run-status",
      ],
      brandedIdTypeNames: CONSOLIDATION_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: CONSOLIDATION_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: CONSOLIDATION_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-CONSOLIDATION"
    );
  });

  it("lists closed vocabularies", () => {
    expect(CONSOLIDATION_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(CONSOLIDATION_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(CONSOLIDATION_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "CustomerId"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertConsolidationDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(
      isConsolidationAuditAction(CONSOLIDATION_AUDIT_ACTIONS[0] ?? "")
    ).toBe(true);
    expect(isConsolidationScope("legal")).toBe(true);
    expect(isEliminationType("investment")).toBe(true);
    expect(isReportingCurrencyMethod("closing")).toBe(true);
    expect(isConsolidationRunStatus("draft")).toBe(true);
  });
});

describe("PAS-001B consolidation domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(CONSOLIDATION_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
