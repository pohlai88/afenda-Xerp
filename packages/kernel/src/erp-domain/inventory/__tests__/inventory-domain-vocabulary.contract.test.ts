import { describe, expect, it } from "vitest";

import {
  type assertInventoryDomainVocabularyRegistryIntegrity,
  INVENTORY_AUDIT_ACTIONS,
  INVENTORY_DOMAIN_AUDIT_VOCABULARY,
  INVENTORY_DOMAIN_AUTHORITY_METADATA,
  INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES,
  INVENTORY_DOMAIN_BRANDED_IDS,
  INVENTORY_DOMAIN_CLOSED_VOCABULARIES,
  INVENTORY_DOMAIN_PERMISSION_VOCABULARY,
  INVENTORY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  INVENTORY_DOMAIN_VOCABULARY_POLICY,
  INVENTORY_DOMAIN_VOCABULARY_REGISTRY,
  INVENTORY_DOMAIN_VOCABULARY_REGISTRY_ID,
  INVENTORY_DOMAIN_WIRE_CONTEXT,
  INVENTORY_PERMISSION_KEY_VOCABULARY,
  INVENTORY_RECORD_STATUSES,
  isInventoryAuditAction,
  isInventoryRecordStatus,
  isStockMovementType,
  isStockReservationStatus,
  isValuationMethod,
  STOCK_MOVEMENT_TYPES,
  STOCK_RESERVATION_STATUSES,
  VALUATION_METHODS,
} from "../index.js";

describe("PAS-001B inventory domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(INVENTORY_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8");
    expect(INVENTORY_DOMAIN_VOCABULARY_REGISTRY.id).toBe("PAS-001B-4.8");
  });

  it("lists closed vocabularies with non-empty value counts", () => {
    expect(
      INVENTORY_DOMAIN_CLOSED_VOCABULARIES.map((entry) => entry.id)
    ).toEqual([
      "stock-movement-type",
      "inventory-record-status",
      "stock-reservation-status",
      "valuation-method",
    ]);

    for (const entry of INVENTORY_DOMAIN_CLOSED_VOCABULARIES) {
      expect(entry.pasSection).toBe("4.8");
      expect(entry.valueCount).toBeGreaterThan(0);
    }
  });

  it("keeps closed vocabulary counts aligned with live constants", () => {
    const byId = Object.fromEntries(
      INVENTORY_DOMAIN_CLOSED_VOCABULARIES.map((entry) => [entry.id, entry])
    );

    expect(byId["stock-movement-type"]?.valueCount).toBe(
      STOCK_MOVEMENT_TYPES.length
    );
    expect(byId["inventory-record-status"]?.valueCount).toBe(
      INVENTORY_RECORD_STATUSES.length
    );
    expect(byId["stock-reservation-status"]?.valueCount).toBe(
      STOCK_RESERVATION_STATUSES.length
    );
    expect(byId["valuation-method"]?.valueCount).toBe(VALUATION_METHODS.length);
  });

  it("excludes business-reference IDs from domain branded surface (Rule 2)", () => {
    expect(INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES).toEqual([
      "StockMovementId",
      "StockAdjustmentId",
      "InventoryCountSessionId",
    ]);
    expect(INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("ProductId");
    expect(INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("WarehouseId");

    for (const entry of INVENTORY_DOMAIN_BRANDED_IDS) {
      expect(entry.brandFunction).toMatch(/^brand/);
      expect(entry.toFunction).toMatch(/^to/);
    }
  });

  it("registers wire context, audit, permission, and authority metadata", () => {
    expect(INVENTORY_DOMAIN_WIRE_CONTEXT.typeExport).toBe(
      "InventoryDomainWireContext"
    );
    expect(INVENTORY_DOMAIN_AUDIT_VOCABULARY.valueCount).toBe(
      INVENTORY_AUDIT_ACTIONS.length
    );
    expect(INVENTORY_DOMAIN_PERMISSION_VOCABULARY.keyCount).toBe(
      INVENTORY_PERMISSION_KEY_VOCABULARY.length
    );
    expect(INVENTORY_DOMAIN_AUTHORITY_METADATA.currentLifecycle).toBe(
      "contracts-only"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertInventoryDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isInventoryAuditAction("movement.posted")).toBe(true);
    expect(isStockMovementType("transfer")).toBe(true);
    expect(isInventoryRecordStatus("active")).toBe(true);
    expect(isStockReservationStatus("reserved")).toBe(true);
    expect(isValuationMethod("fifo")).toBe(true);
  });
});

describe("PAS-001B inventory domain vocabulary policy", () => {
  it("freezes prohibited runtime surfaces", () => {
    expect(INVENTORY_DOMAIN_PROHIBITED_RUNTIME_SURFACES.length).toBeGreaterThan(
      0
    );
    expect(INVENTORY_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:inventory-domain-contracts"
    );
    expect(INVENTORY_DOMAIN_VOCABULARY_POLICY.businessReferenceNote).toContain(
      "ProductId"
    );
  });
});
