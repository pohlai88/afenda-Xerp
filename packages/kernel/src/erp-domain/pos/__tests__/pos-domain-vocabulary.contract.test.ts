import { describe, expect, it } from "vitest";

import {
  type assertPosDomainVocabularyRegistryIntegrity,
  isPosAuditAction,
  isPosSessionStatus,
  isShiftStatus,
  isTenderType,
  isTransactionType,
  POS_AUDIT_ACTIONS,
  POS_DOMAIN_BRANDED_ID_TYPE_NAMES,
  POS_DOMAIN_CLOSED_VOCABULARIES,
  POS_DOMAIN_VOCABULARY_POLICY,
  POS_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B pos domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(POS_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-POS");
  });

  it("lists closed vocabularies", () => {
    expect(POS_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(POS_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(POS_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertPosDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isPosAuditAction(POS_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isPosSessionStatus("open")).toBe(true);
    expect(isTenderType("cash")).toBe(true);
    expect(isTransactionType("sale")).toBe(true);
    expect(isShiftStatus("open")).toBe(true);
  });
});

describe("PAS-001B pos domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(POS_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
