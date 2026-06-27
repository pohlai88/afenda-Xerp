import { describe, expect, it } from "vitest";

import {
  buildEnterpriseIdCheckPattern,
  createEnterpriseId,
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  enterpriseIdUniqueIndexName,
  idRef,
  primaryId,
  satisfiesEnterpriseIdFormatCheck,
  tenantHumanReferenceColumn,
  tenantHumanReferenceUniqueIndexName,
  tenantIdRef,
} from "../index.js";

describe("ids module", () => {
  it("primaryId and idRef return drizzle column builders", () => {
    expect(primaryId()).toBeDefined();
    expect(idRef("tenant_id")).toBeDefined();
    expect(tenantIdRef()).toBeDefined();
  });

  it("builds family-specific enterprise_id CHECK patterns", () => {
    expect(buildEnterpriseIdCheckPattern("tenant")).toBe(
      "^ten_[0-9A-HJKMNP-TV-Z]{26}$"
    );
    expect(buildEnterpriseIdCheckPattern("product")).toBe(
      "^prd_[0-9A-HJKMNP-TV-Z]{26}$"
    );
    expect(buildEnterpriseIdCheckPattern("employee")).toBe(
      "^emp_[0-9A-HJKMNP-TV-Z]{26}$"
    );
  });

  it("generates governed enterprise IDs with family prefix", () => {
    const id = createEnterpriseId("product");
    expect(id).toMatch(/^prd_[0-9A-HJKMNP-TV-Z]{26}$/);
  });

  it("idRef exposes uuid FK builders for split-ID persistence", () => {
    expect(idRef("product_id")).toBeDefined();
  });

  it("tenantHumanReferenceColumn builds a column for sku scope", () => {
    expect(tenantHumanReferenceColumn("sku")).toBeDefined();
  });

  it("index policy helpers match pilot naming", () => {
    expect(enterpriseIdUniqueIndexName("tenants")).toBe(
      "tenants_enterprise_id_unique"
    );
    expect(tenantHumanReferenceUniqueIndexName("products", "sku")).toBe(
      "products_tenant_sku_unique"
    );
  });

  it("enterpriseIdFormatCheck accepts nullable enterprise_id during backfill", () => {
    const column = enterpriseIdColumn("tenant");
    const constraint = enterpriseIdFormatCheck(column, "tenant");
    expect(constraint.name).toContain("enterprise_id_tenant_format");
  });

  it("satisfiesEnterpriseIdFormatCheck mirrors Postgres CHECK semantics", () => {
    const valid = createEnterpriseId("tenant");
    expect(satisfiesEnterpriseIdFormatCheck(valid, "tenant")).toBe(true);
    expect(satisfiesEnterpriseIdFormatCheck(null, "tenant")).toBe(true);
    expect(satisfiesEnterpriseIdFormatCheck("cus_not-valid", "tenant")).toBe(
      false
    );
  });
});
