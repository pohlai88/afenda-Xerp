import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertTreasuryDomainVocabularyRegistryIntegrity,
  isHedgeAccountingMethod,
  isLiquidityStatus,
  isPaymentRunStatus,
  isTreasuryAuditAction,
  isTreasuryInstrumentType,
  TREASURY_AUDIT_ACTIONS,
  TREASURY_DOMAIN_AUDIT_VOCABULARY,
  TREASURY_DOMAIN_BRANDED_ID_TYPE_NAMES,
  TREASURY_DOMAIN_CLOSED_VOCABULARIES,
  TREASURY_DOMAIN_PERMISSION_VOCABULARY,
  TREASURY_DOMAIN_VOCABULARY_POLICY,
  TREASURY_DOMAIN_VOCABULARY_REGISTRY,
  TREASURY_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B treasury domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: TREASURY_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: TREASURY_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "treasury-instrument-type",
        "liquidity-status",
        "payment-run-status",
        "hedge-accounting-method",
      ],
      brandedIdTypeNames: TREASURY_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: TREASURY_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: TREASURY_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(TREASURY_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-TREASURY"
    );
  });

  it("lists closed vocabularies", () => {
    expect(TREASURY_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(TREASURY_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(TREASURY_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertTreasuryDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isTreasuryAuditAction(TREASURY_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isTreasuryInstrumentType("cash")).toBe(true);
    expect(isLiquidityStatus("surplus")).toBe(true);
    expect(isPaymentRunStatus("draft")).toBe(true);
    expect(isHedgeAccountingMethod("none")).toBe(true);
  });
});

describe("PAS-001B treasury domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(TREASURY_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
