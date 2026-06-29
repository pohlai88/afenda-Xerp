import { describe, expect, it } from "vitest";
import type {
  AssetId,
  CustomerId,
  DocumentId,
  ProductId,
  TenantId,
} from "../identity/index.js";
import { createTestEnterpriseId } from "../identity/index.js";
import {
  type AssetWireReference,
  brandAssetWireReference,
  brandCustomerWireReference,
  brandDocumentWireReference,
  brandProductWireReference,
  type CustomerWireReference,
  type DocumentWireReference,
  identityScopeRuleFromRegistry,
  type ProductWireReference,
  toAssetWireReference,
  toCustomerWireReference,
  toDocumentWireReference,
  toProductWireReference,
} from "../identity/wire/business-reference-wire.contract.js";
import {
  TEST_COMPANY_ID,
  TEST_CUSTOMER_ID,
  TEST_PRODUCT_ID,
  TEST_TENANT_ID,
} from "./fixtures/enterprise-id.fixtures.js";

const TEST_DOCUMENT_ID = createTestEnterpriseId("document");
const TEST_ASSET_ID = createTestEnterpriseId("asset");

describe("@afenda/kernel business reference wire boundary (K7)", () => {
  it("derives tenant_catalog identity scope without company id", () => {
    const rule = identityScopeRuleFromRegistry("tenant_catalog", {
      tenantId: "tenant-1",
    });

    expect(rule).toEqual({ kind: "tenant_catalog", tenantId: "tenant-1" });
  });

  it("derives tenant_and_company identity scope with company id", () => {
    const rule = identityScopeRuleFromRegistry("tenant_and_company", {
      tenantId: "tenant-1",
      companyId: "company-1",
    });

    expect(rule).toEqual({
      kind: "tenant_and_company",
      tenantId: "tenant-1",
      companyId: "company-1",
    });
  });

  it("round-trips customer wire reference through branded trust boundary", () => {
    const wire: CustomerWireReference = {
      tenantId: TEST_TENANT_ID,
      companyId: TEST_COMPANY_ID,
      customerId: TEST_CUSTOMER_ID,
      customerCode: "C-001",
    };

    const branded = brandCustomerWireReference(wire);
    expect(toCustomerWireReference(branded)).toEqual(wire);
  });

  it("round-trips product wire reference through branded trust boundary", () => {
    const wire: ProductWireReference = {
      tenantId: TEST_TENANT_ID,
      productId: TEST_PRODUCT_ID,
      sku: "SKU-001",
    };

    const branded = brandProductWireReference(wire);
    expect(toProductWireReference(branded)).toEqual(wire);
  });

  it("round-trips document wire reference through branded trust boundary", () => {
    const wire: DocumentWireReference = {
      tenantId: TEST_TENANT_ID,
      companyId: TEST_COMPANY_ID,
      documentId: TEST_DOCUMENT_ID,
      documentType: "invoice",
      documentNo: "INV-2026-000001",
    };

    const branded = brandDocumentWireReference(wire);
    expect(toDocumentWireReference(branded)).toEqual(wire);
  });

  it("round-trips asset wire reference through branded trust boundary", () => {
    const wire: AssetWireReference = {
      tenantId: TEST_TENANT_ID,
      companyId: TEST_COMPANY_ID,
      assetId: TEST_ASSET_ID,
      assetTag: "AST-001",
    };

    const branded = brandAssetWireReference(wire);
    expect(toAssetWireReference(branded)).toEqual(wire);
  });
});

type AssertSerializable<T> = T extends string | number | boolean | null
  ? true
  : T extends readonly (infer U)[]
    ? AssertSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _BrandedIdsSerializable = AssertSerializable<
  CustomerId | ProductId | TenantId | DocumentId | AssetId
>;
