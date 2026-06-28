import { describe, expect, it } from "vitest";

import {
  type assertFieldServiceDomainVocabularyRegistryIntegrity,
  FIELD_SERVICE_AUDIT_ACTIONS,
  FIELD_SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  FIELD_SERVICE_DOMAIN_CLOSED_VOCABULARIES,
  FIELD_SERVICE_DOMAIN_VOCABULARY_POLICY,
  FIELD_SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID,
  isDispatchPriority,
  isFieldServiceAuditAction,
  isRouteStatus,
  isVisitOutcome,
  isWorkOrderStatus,
} from "../index.js";

describe("PAS-001B field-service domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(FIELD_SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-FIELD_SERVICE"
    );
  });

  it("lists closed vocabularies", () => {
    expect(FIELD_SERVICE_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(FIELD_SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(FIELD_SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "CustomerId"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertFieldServiceDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(
      isFieldServiceAuditAction(FIELD_SERVICE_AUDIT_ACTIONS[0] ?? "")
    ).toBe(true);
    expect(isWorkOrderStatus("scheduled")).toBe(true);
    expect(isDispatchPriority("routine")).toBe(true);
    expect(isVisitOutcome("completed")).toBe(true);
    expect(isRouteStatus("planned")).toBe(true);
  });
});

describe("PAS-001B field-service domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(FIELD_SERVICE_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
