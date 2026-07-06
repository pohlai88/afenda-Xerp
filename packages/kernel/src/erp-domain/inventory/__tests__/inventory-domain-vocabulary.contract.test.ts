import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertInventoryDomainVocabularyRegistryIntegrity,
  INVENTORY_AUDIT_ACTIONS,
  INVENTORY_DOMAIN_AUDIT_VOCABULARY,
  INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES,
  INVENTORY_DOMAIN_CLOSED_VOCABULARIES,
  INVENTORY_DOMAIN_PERMISSION_VOCABULARY,
  INVENTORY_DOMAIN_VOCABULARY_POLICY,
  INVENTORY_DOMAIN_VOCABULARY_REGISTRY,
  INVENTORY_DOMAIN_VOCABULARY_REGISTRY_ID,
  isInventoryAuditAction,
  isInventoryRecordStatus,
  isStockMovementType,
  isStockReservationStatus,
  isValuationMethod,
} from "../index.js";

describe("PAS-001B inventory domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: INVENTORY_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: INVENTORY_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "stock-movement-type",
        "inventory-record-status",
        "stock-reservation-status",
        "valuation-method",
      ],
      brandedIdTypeNames: INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES,
      auditActionCount: INVENTORY_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: INVENTORY_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(INVENTORY_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-INVENTORY"
    );
    expect(INVENTORY_DOMAIN_VOCABULARY_REGISTRY.id).toBe(
      "PAS-001B-4.8-INVENTORY"
    );
  });

  it("lists closed vocabularies with expected count", () => {
    expect(INVENTORY_DOMAIN_CLOSED_VOCABULARIES.length).toBe(4);
  });

  it("registers branded IDs", () => {
    expect(INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES.length).toBe(3);
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertInventoryDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isInventoryAuditAction(INVENTORY_AUDIT_ACTIONS[0] ?? "")).toBe(true);
    expect(isStockMovementType("receipt")).toBe(true);
    expect(isInventoryRecordStatus("active")).toBe(true);
    expect(isStockReservationStatus("draft")).toBe(true);
    expect(isValuationMethod("standard")).toBe(true);
  });

  it("excludes business-reference IDs from domain branded surface (Rule 2)", () => {
    expect(INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("ProductId");
    expect(INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("WarehouseId");
  });
});

describe("PAS-001B inventory domain vocabulary policy", () => {
  it("uses unified delivered vocabulary gate", () => {
    expect(INVENTORY_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
    expect(INVENTORY_DOMAIN_VOCABULARY_POLICY.pas001bSlice).toBe("B79");
  });
});
