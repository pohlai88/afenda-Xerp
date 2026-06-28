import { describe, expect, it } from "vitest";

import {
  type assertMaintenanceDomainVocabularyRegistryIntegrity,
  isDowntimeCategory,
  isMaintenanceAuditAction,
  isMaintenanceOrderStatus,
  isMaintenanceOrderType,
  isMaintenancePriority,
  MAINTENANCE_AUDIT_ACTIONS,
  MAINTENANCE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  MAINTENANCE_DOMAIN_CLOSED_VOCABULARIES,
  MAINTENANCE_DOMAIN_VOCABULARY_POLICY,
  MAINTENANCE_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B maintenance domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(MAINTENANCE_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-MAINTENANCE"
    );
  });

  it("lists closed vocabularies", () => {
    expect(MAINTENANCE_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(MAINTENANCE_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(MAINTENANCE_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "CustomerId"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertMaintenanceDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isMaintenanceAuditAction(MAINTENANCE_AUDIT_ACTIONS[0] ?? "")).toBe(
      true
    );
    expect(isMaintenanceOrderStatus("draft")).toBe(true);
    expect(isMaintenanceOrderType("corrective")).toBe(true);
    expect(isDowntimeCategory("planned")).toBe(true);
    expect(isMaintenancePriority("routine")).toBe(true);
  });
});

describe("PAS-001B maintenance domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(MAINTENANCE_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
