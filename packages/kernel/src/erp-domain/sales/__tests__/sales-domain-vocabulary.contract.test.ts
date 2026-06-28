import { describe, expect, it } from "vitest";

import {
  type assertSalesDomainVocabularyRegistryIntegrity,
  isPricingContext,
  isQuoteStatus,
  isSalesAuditAction,
  isSalesDocumentType,
  isSalesOrderStatus,
  PRICING_CONTEXTS,
  QUOTE_STATUSES,
  SALES_AUDIT_ACTIONS,
  SALES_DOCUMENT_TYPES,
  SALES_DOMAIN_AUDIT_VOCABULARY,
  SALES_DOMAIN_AUTHORITY_METADATA,
  SALES_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SALES_DOMAIN_BRANDED_IDS,
  SALES_DOMAIN_CLOSED_VOCABULARIES,
  SALES_DOMAIN_PERMISSION_VOCABULARY,
  SALES_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  SALES_DOMAIN_VOCABULARY_POLICY,
  SALES_DOMAIN_VOCABULARY_REGISTRY,
  SALES_DOMAIN_VOCABULARY_REGISTRY_ID,
  SALES_DOMAIN_WIRE_CONTEXT,
  SALES_ORDER_STATUSES,
  SALES_PERMISSION_KEY_VOCABULARY,
} from "../index.js";

describe("PAS-001B sales domain vocabulary registry", () => {
  it("declares registry identity", () => {
    expect(SALES_DOMAIN_VOCABULARY_REGISTRY_ID).toBe("PAS-001B-4.8-SALES");
    expect(SALES_DOMAIN_VOCABULARY_REGISTRY.id).toBe("PAS-001B-4.8-SALES");
  });

  it("lists closed vocabularies with non-empty value counts", () => {
    expect(SALES_DOMAIN_CLOSED_VOCABULARIES.map((entry) => entry.id)).toEqual([
      "order-status",
      "quote-status",
      "sales-document-type",
      "pricing-context",
    ]);

    for (const entry of SALES_DOMAIN_CLOSED_VOCABULARIES) {
      expect(entry.pasSection).toBe("4.8");
      expect(entry.valueCount).toBeGreaterThan(0);
    }
  });

  it("keeps closed vocabulary counts aligned with live constants", () => {
    const byId = Object.fromEntries(
      SALES_DOMAIN_CLOSED_VOCABULARIES.map((entry) => [entry.id, entry])
    );

    expect(byId["order-status"]?.valueCount).toBe(SALES_ORDER_STATUSES.length);
    expect(byId["quote-status"]?.valueCount).toBe(QUOTE_STATUSES.length);
    expect(byId["sales-document-type"]?.valueCount).toBe(
      SALES_DOCUMENT_TYPES.length
    );
    expect(byId["pricing-context"]?.valueCount).toBe(PRICING_CONTEXTS.length);
  });

  it("excludes business-reference IDs from domain branded surface (Rule 2)", () => {
    expect(SALES_DOMAIN_BRANDED_ID_TYPE_NAMES).toEqual([
      "SalesOrderId",
      "QuoteId",
      "DeliveryScheduleId",
    ]);
    expect(SALES_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("CustomerId");
    expect(SALES_DOMAIN_BRANDED_ID_TYPE_NAMES).not.toContain("ProductId");

    for (const entry of SALES_DOMAIN_BRANDED_IDS) {
      expect(entry.brandFunction).toMatch(/^brand/);
      expect(entry.toFunction).toMatch(/^to/);
    }
  });

  it("registers wire context, audit, permission, and authority metadata", () => {
    expect(SALES_DOMAIN_WIRE_CONTEXT.typeExport).toBe("SalesDomainWireContext");
    expect(SALES_DOMAIN_AUDIT_VOCABULARY.valueCount).toBe(
      SALES_AUDIT_ACTIONS.length
    );
    expect(SALES_DOMAIN_PERMISSION_VOCABULARY.keyCount).toBe(
      SALES_PERMISSION_KEY_VOCABULARY.length
    );
    expect(SALES_DOMAIN_AUTHORITY_METADATA.currentLifecycle).toBe(
      "contracts-only"
    );
  });

  it("satisfies compile-time registry integrity guard", () => {
    type Guard = assertSalesDomainVocabularyRegistryIntegrity;
    const guard: Guard = true;
    expect(guard).toBe(true);
  });

  it("narrows audit and vocabulary helpers", () => {
    expect(isSalesAuditAction("sales_order.confirmed")).toBe(true);
    expect(isSalesOrderStatus("partially_shipped")).toBe(true);
    expect(isQuoteStatus("accepted")).toBe(true);
    expect(isSalesDocumentType("contract")).toBe(true);
    expect(isPricingContext("campaign")).toBe(true);
  });
});

describe("PAS-001B sales domain vocabulary policy", () => {
  it("freezes prohibited runtime surfaces", () => {
    expect(SALES_DOMAIN_PROHIBITED_RUNTIME_SURFACES.length).toBeGreaterThan(0);
    expect(SALES_DOMAIN_VOCABULARY_POLICY.enforcementGate).toBe(
      "pnpm check:erp-domain-delivered-vocabulary"
    );
    expect(SALES_DOMAIN_VOCABULARY_POLICY.businessReferenceNote).toContain(
      "CustomerId"
    );
  });
});
