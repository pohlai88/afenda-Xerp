import { describe, expect, it } from "vitest";

import {
  type assertServiceDomainVocabularyRegistryIntegrity,
  isCasePriority,
  isCaseStatus,
  isResolutionType,
  isServiceAuditAction,
  isServiceLevel,
  SERVICE_AUDIT_ACTIONS,
  SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SERVICE_DOMAIN_CLOSED_VOCABULARIES,
  SERVICE_DOMAIN_VOCABULARY_POLICY,
  SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B service domain vocabulary registry", () => {
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
