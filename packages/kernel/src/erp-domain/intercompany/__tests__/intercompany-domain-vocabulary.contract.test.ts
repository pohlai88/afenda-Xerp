import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertIntercompanyDomainVocabularyRegistryIntegrity,
  IC_BILLING_DIRECTIONS,
  IC_MATCHING_STATUSES,
  IC_SETTLEMENT_METHODS,
  IC_TRANSACTION_TYPES,
  INTERCOMPANY_AUDIT_ACTIONS,
  INTERCOMPANY_DOMAIN_AUDIT_VOCABULARY,
  INTERCOMPANY_DOMAIN_AUTHORITY_METADATA,
  INTERCOMPANY_DOMAIN_BRANDED_ID_TYPE_NAMES,
  INTERCOMPANY_DOMAIN_BRANDED_IDS,
  INTERCOMPANY_DOMAIN_CLOSED_VOCABULARIES,
  INTERCOMPANY_DOMAIN_PERMISSION_VOCABULARY,
  INTERCOMPANY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  INTERCOMPANY_DOMAIN_VOCABULARY_POLICY,
  INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY,
  INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY_ID,
  INTERCOMPANY_DOMAIN_WIRE_CONTEXT,
  INTERCOMPANY_PERMISSION_KEY_VOCABULARY,
  isIcBillingDirection,
  isIcMatchingStatus,
  isIcSettlementMethod,
  isIcTransactionType,
  isIntercompanyAuditAction,
} from "../index.js";

describe("PAS-001B intercompany domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "ic-transaction-type",
        "ic-matching-status",
        "ic-settlement-method",
        "ic-billing-direction",
      ],
      brandedIdTypeNames: INTERCOMPANY_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: INTERCOMPANY_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: INTERCOMPANY_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-INTERCOMPANY"
    );
    expect(INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY.id).toBe(
      "PAS-001B-4.8-INTERCOMPANY"
    );
  });

  it("lists closed vocabularies with non-empty value counts", () => {
    expect(
      INTERCOMPANY_DOMAIN_CLOSED_VOCABULARIES.map((entry) => entry.id)
    ).toEqual([
      "ic-transaction-type",
      "ic-matching-status",
      "ic-settlement-method",
      "ic-billing-direction",
    ]);

    for (const entry of INTERCOMPANY_DOMAIN_CLOSED_VOCABULARIES) {
      expect(entry.pasSection).toBe("4.8");
      expect(entry.valueCount).toBeGreaterThan(0);
    }
  });

  it("keeps closed vocabulary counts aligned with live constants", () => {
    const byId = Object.fromEntries(
      INTERCOMPANY_DOMAIN_CLOSED_VOCABULARIES.map((entry) => [entry.id, entry])
    );

    expect(byId["ic-transaction-type"]?.valueCount).toBe(
      IC_TRANSACTION_TYPES.length
    );
    expect(byId["ic-matching-status"]?.valueCount).toBe(
      IC_MATCHING_STATUSES.length
    );
    expect(byId["ic-settlement-method"]?.valueCount).toBe(
      IC_SETTLEMENT_METHODS.length
    );
    expect(byId["ic-billing-direction"]?.valueCount).toBe(
      IC_BILLING_DIRECTIONS.length
    );
  });

  it("excludes business-reference IDs from domain branded surface (Rule 2)", () => {
    expect(INTERCOMPANY_DOMAIN_BRANDED_ID_TYPE_NAMES).toEqual([
      "IntercompanyAgreementId",
      "IcMatchingRunId",
      "IcSettlementId",
    ]);
    expect(INTERCOMPANY_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "CustomerId"
    );
    expect(INTERCOMPANY_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "ProductId"
    );

    for (const entry of INTERCOMPANY_DOMAIN_BRANDED_IDS) {
      expect(entry.brandFunction).toMatch(/^brand/);
      expect(entry.toFunction).toMatch(/^to/);
    }
  });

  it("registers wire context, audit, permission, and authority metadata", () => {
    expect(INTERCOMPANY_DOMAIN_WIRE_CONTEXT.typeExport).toBe(
      "IntercompanyDomainWireContext"
    );
    expect(INTERCOMPANY_DOMAIN_AUDIT_VOCABULARY.valueCount).toBe(
      INTERCOMPANY_AUDIT_ACTIONS.length
    );
    expect(INTERCOMPANY_DOMAIN_PERMISSION_VOCABULARY.keyCount).toBe(
      INTERCOMPANY_PERMISSION_KEY_VOCABULARY.length
    );
    expect(INTERCOMPANY_DOMAIN_AUTHORITY_METADATA.currentLifecycle).toBe(
      "contracts-only"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertIntercompanyDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isIntercompanyAuditAction("ic_matching_run.settled")).toBe(true);
    expect(isIcTransactionType("dividend")).toBe(true);
    expect(isIcMatchingStatus("disputed")).toBe(true);
    expect(isIcSettlementMethod("central_treasury")).toBe(true);
    expect(isIcBillingDirection("bilateral")).toBe(true);
  });
});

describe("PAS-001B intercompany domain vocabulary policy", () => {
  it("freezes prohibited runtime surfaces", () => {
    expect(
      INTERCOMPANY_DOMAIN_PROHIBITED_RUNTIME_SURFACES.length
    ).toBeGreaterThan(0);
    expect(INTERCOMPANY_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
    expect(
      INTERCOMPANY_DOMAIN_VOCABULARY_POLICY.businessReferenceNote
    ).toContain("CustomerId");
  });
});
