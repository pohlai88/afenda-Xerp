import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY,
  brandCustomerWireReference,
  brandProductWireReference,
  type CustomerWireReference,
  getBusinessMasterDataAuthority,
  identityScopeRuleFromRegistry,
  type ProductWireReference,
  toCustomerWireReference,
  toProductWireReference,
} from "../contracts/business-master-data/index.js";
import type {
  CustomerId,
  ProductId,
  TenantId,
} from "../contracts/platform-id.contract.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const boundaryContractPath = join(
  repoRoot,
  "packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts"
);

describe("@afenda/kernel business master data id boundary (TIP-008B Slice 3)", () => {
  it("points every registry entry at the id-boundary contract on disk", () => {
    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      expect(entry.kernelContractPath).toBeTruthy();
      expect(
        existsSync(join(repoRoot, entry.kernelContractPath as string))
      ).toBe(true);
    }
  });

  it("exports every registry kernelContractExport from the boundary module", () => {
    const boundarySource = readFileSync(boundaryContractPath, "utf8");

    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      expect(entry.kernelContractExport).toBeTruthy();
      expect(
        boundarySource.includes(entry.kernelContractExport as string),
        `${entry.kernelContractExport} missing from boundary contract`
      ).toBe(true);
    }
  });

  it("derives tenant_catalog identity scope without company id", () => {
    const product = getBusinessMasterDataAuthority("product");
    expect(product.identityScope).toBe("tenant_catalog");

    const rule = identityScopeRuleFromRegistry(product.identityScope, {
      tenantId: "tenant-1",
    });

    expect(rule).toEqual({ kind: "tenant_catalog", tenantId: "tenant-1" });
  });

  it("derives tenant_and_company identity scope with company id", () => {
    const customer = getBusinessMasterDataAuthority("customer");
    const rule = identityScopeRuleFromRegistry(customer.identityScope, {
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
      tenantId: "tenant-1",
      companyId: "company-1",
      customerId: "customer-1",
      customerCode: "C-001",
    };

    const branded = brandCustomerWireReference(wire);
    expect(toCustomerWireReference(branded)).toEqual(wire);
  });

  it("round-trips product wire reference through branded trust boundary", () => {
    const wire: ProductWireReference = {
      tenantId: "tenant-1",
      productId: "product-1",
      sku: "SKU-001",
    };

    const branded = brandProductWireReference(wire);
    expect(toProductWireReference(branded)).toEqual(wire);
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
  CustomerId | ProductId | TenantId
>;
