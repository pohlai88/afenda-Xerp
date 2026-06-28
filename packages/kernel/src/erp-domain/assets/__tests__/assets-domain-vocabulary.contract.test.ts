import { describe, expect, it } from "vitest";

import {
  ASSETS_AUDIT_ACTIONS,
  ASSETS_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ASSETS_DOMAIN_CLOSED_VOCABULARIES,
  ASSETS_DOMAIN_VOCABULARY_POLICY,
  ASSETS_DOMAIN_VOCABULARY_REGISTRY_ID,
  type assertAssetsDomainVocabularyRegistryIntegrity,
  isAssetClass,
  isAssetStatus,
  isAssetsAuditAction,
  isDepreciationMethod,
  isTransferType,
} from "../index.js";

describe("PAS-001B assets domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(ASSETS_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-ASSETS");
  });

  it("lists closed vocabularies", () => {
    expect(ASSETS_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(ASSETS_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(ASSETS_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertAssetsDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isAssetsAuditAction(ASSETS_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isAssetStatus("active")).toBe(true);
    expect(isDepreciationMethod("straight_line")).toBe(true);
    expect(isAssetClass("tangible")).toBe(true);
    expect(isTransferType("internal")).toBe(true);
  });
});

describe("PAS-001B assets domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(ASSETS_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
