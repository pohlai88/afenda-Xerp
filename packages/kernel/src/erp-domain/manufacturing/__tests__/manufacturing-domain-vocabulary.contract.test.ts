import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertManufacturingDomainVocabularyRegistryIntegrity,
  isCapacityPlanningMethod,
  isManufacturingAuditAction,
  isManufacturingOrderType,
  isProductionOrderStatus,
  isShopFloorEventType,
  MANUFACTURING_AUDIT_ACTIONS,
  MANUFACTURING_DOMAIN_AUDIT_VOCABULARY,
  MANUFACTURING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  MANUFACTURING_DOMAIN_CLOSED_VOCABULARIES,
  MANUFACTURING_DOMAIN_PERMISSION_VOCABULARY,
  MANUFACTURING_DOMAIN_VOCABULARY_POLICY,
  MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY,
  MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY_ID,
} from "../index.js";

describe("PAS-001B manufacturing domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "production-order-status",
        "manufacturing-order-type",
        "capacity-planning-method",
        "shop-floor-event-type",
      ],
      brandedIdTypeNames: MANUFACTURING_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: MANUFACTURING_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: MANUFACTURING_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-MANUFACTURING"
    );
  });

  it("lists closed vocabularies", () => {
    expect(MANUFACTURING_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs without business-reference duplication", () => {
    expect(MANUFACTURING_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
    expect(MANUFACTURING_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "CustomerId"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertManufacturingDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(
      isManufacturingAuditAction(MANUFACTURING_AUDIT_ACTIONS[0] ?? "")
    ).toBe(true);
    expect(isProductionOrderStatus("planned")).toBe(true);
    expect(isManufacturingOrderType("standard")).toBe(true);
    expect(isCapacityPlanningMethod("finite")).toBe(true);
    expect(isShopFloorEventType("start")).toBe(true);
  });
});

describe("PAS-001B manufacturing domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(MANUFACTURING_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
  });
});
