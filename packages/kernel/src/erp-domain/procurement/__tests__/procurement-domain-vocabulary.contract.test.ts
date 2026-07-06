import { describe, expect, it } from "vitest";

import { assertDeliveredDomainVocabularyRegistry } from "../../__tests__/domain-vocabulary-registry.harness.js";
import {
  type assertProcurementDomainVocabularyRegistryIntegrity,
  isProcurementAuditAction,
  isProcurementDocumentType,
  isPurchaseOrderStatus,
  isPurchaseRequisitionStatus,
  isSourcingMethod,
  PROCUREMENT_AUDIT_ACTIONS,
  PROCUREMENT_DOCUMENT_TYPES,
  PROCUREMENT_DOMAIN_AUDIT_VOCABULARY,
  PROCUREMENT_DOMAIN_AUTHORITY_METADATA,
  PROCUREMENT_DOMAIN_BRANDED_ID_TYPE_NAMES,
  PROCUREMENT_DOMAIN_BRANDED_IDS,
  PROCUREMENT_DOMAIN_CLOSED_VOCABULARIES,
  PROCUREMENT_DOMAIN_PERMISSION_VOCABULARY,
  PROCUREMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  PROCUREMENT_DOMAIN_VOCABULARY_POLICY,
  PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY,
  PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY_ID,
  PROCUREMENT_DOMAIN_WIRE_CONTEXT,
  PROCUREMENT_PERMISSION_KEY_VOCABULARY,
  PURCHASE_ORDER_STATUSES,
  PURCHASE_REQUISITION_STATUSES,
  SOURCING_METHODS,
} from "../index.js";

describe("PAS-001B procurement domain vocabulary registry", () => {
  it("satisfies delivered domain vocabulary registry harness", () => {
    assertDeliveredDomainVocabularyRegistry({
      registryId: PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY_ID,
      registry: PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY,
      closedVocabularyIds: [
        "purchase-requisition-status",
        "purchase-order-status",
        "procurement-document-type",
        "sourcing-method",
      ],
      brandedIdTypeNames: PROCUREMENT_DOMAIN_BRANDED_ID_TYPE_NAMES,
      excludedBrandedIdTypeNames: ["SupplierId", "ProductId"],
      auditActionCount: PROCUREMENT_DOMAIN_AUDIT_VOCABULARY.valueCount,
      permissionKeyCount: PROCUREMENT_DOMAIN_PERMISSION_VOCABULARY.keyCount,
      currentLifecycle: "contracts-only",
    });
  });

  it("declares registry identity", () => {
    expect(PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY_ID).toBe(
      "PAS-001B-4.8-PROCUREMENT"
    );
    expect(PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY.id).toBe(
      "PAS-001B-4.8-PROCUREMENT"
    );
  });

  it("lists closed vocabularies with non-empty value counts", () => {
    expect(
      PROCUREMENT_DOMAIN_CLOSED_VOCABULARIES.map((entry) => entry.id)
    ).toEqual([
      "purchase-requisition-status",
      "purchase-order-status",
      "procurement-document-type",
      "sourcing-method",
    ]);

    for (const entry of PROCUREMENT_DOMAIN_CLOSED_VOCABULARIES) {
      expect(entry.pasSection).toBe("4.8");
      expect(entry.valueCount).toBeGreaterThan(0);
    }
  });

  it("keeps closed vocabulary counts aligned with live constants", () => {
    const byId = Object.fromEntries(
      PROCUREMENT_DOMAIN_CLOSED_VOCABULARIES.map((entry) => [entry.id, entry])
    );

    expect(byId["purchase-requisition-status"]?.valueCount).toBe(
      PURCHASE_REQUISITION_STATUSES.length
    );
    expect(byId["purchase-order-status"]?.valueCount).toBe(
      PURCHASE_ORDER_STATUSES.length
    );
    expect(byId["procurement-document-type"]?.valueCount).toBe(
      PROCUREMENT_DOCUMENT_TYPES.length
    );
    expect(byId["sourcing-method"]?.valueCount).toBe(SOURCING_METHODS.length);
  });

  it("excludes business-reference IDs from domain branded surface (Rule 2)", () => {
    expect(PROCUREMENT_DOMAIN_BRANDED_ID_TYPE_NAMES).toEqual([
      "PurchaseRequisitionId",
      "PurchaseOrderId",
      "RfqId",
    ]);
    expect(PROCUREMENT_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain(
      "SupplierId"
    );
    expect(PROCUREMENT_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("ProductId");

    for (const entry of PROCUREMENT_DOMAIN_BRANDED_IDS) {
      expect(entry.brandFunction).toMatch(/^brand/);
      expect(entry.toFunction).toMatch(/^to/);
    }
  });

  it("registers wire context, audit, permission, and authority metadata", () => {
    expect(PROCUREMENT_DOMAIN_WIRE_CONTEXT.typeExport).toBe(
      "ProcurementDomainWireContext"
    );
    expect(PROCUREMENT_DOMAIN_AUDIT_VOCABULARY.valueCount).toBe(
      PROCUREMENT_AUDIT_ACTIONS.length
    );
    expect(PROCUREMENT_DOMAIN_PERMISSION_VOCABULARY.keyCount).toBe(
      PROCUREMENT_PERMISSION_KEY_VOCABULARY.length
    );
    expect(PROCUREMENT_DOMAIN_AUTHORITY_METADATA.currentLifecycle).toBe(
      "contracts-only"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertProcurementDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isProcurementAuditAction("purchase_order.sent")).toBe(true);
    expect(isPurchaseRequisitionStatus("approved")).toBe(true);
    expect(isPurchaseOrderStatus("partially_received")).toBe(true);
    expect(isProcurementDocumentType("blanket_agreement")).toBe(true);
    expect(isSourcingMethod("rfq")).toBe(true);
  });
});

describe("PAS-001B procurement domain vocabulary policy", () => {
  it("freezes prohibited runtime surfaces", () => {
    expect(
      PROCUREMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES.length
    ).toBeGreaterThan(0);
    expect(PROCUREMENT_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:procurement-domain-contracts"
    );
    expect(
      PROCUREMENT_DOMAIN_VOCABULARY_POLICY.businessReferenceNote
    ).toContain("SupplierId");
  });
});
