import { describe, expect, it } from "vitest";

import {
  type assertQualityDomainVocabularyRegistryIntegrity,
  isDispositionCode,
  isInspectionResultStatus,
  isInspectionType,
  isQualityAuditAction,
  isQualityNotificationPriority,
  QUALITY_AUDIT_ACTIONS,
  QUALITY_DOMAIN_BRANDED_ID_TYPE_NAMES,
  QUALITY_DOMAIN_CLOSED_VOCABULARIES,
  QUALITY_DOMAIN_VOCABULARY_POLICY,
  QUALITY_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B quality domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(QUALITY_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-QUALITY");
  });

  it("lists closed vocabularies", () => {
    expect(QUALITY_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(QUALITY_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(QUALITY_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertQualityDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isQualityAuditAction(QUALITY_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isInspectionResultStatus("pending")).toBe(true);
    expect(isQualityNotificationPriority("low")).toBe(true);
    expect(isInspectionType("incoming")).toBe(true);
    expect(isDispositionCode("accept")).toBe(true);
  });
});

describe("PAS-001B quality domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(QUALITY_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
