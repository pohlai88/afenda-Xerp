import { describe, expect, it } from "vitest";

import {
  ERP_DOMAIN_MODULE_KV_IDS,
  ERP_DOMAIN_MODULES,
  ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT,
} from "../../erp-domain/erp-domain-layout.contract.js";

describe("PAS-001B erp-domain layout KV registry", () => {
  it("maps 28 slugs to unique KV-* ids", () => {
    expect(ERP_DOMAIN_MODULES).toHaveLength(
      ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT
    );
    const kvValues = ERP_DOMAIN_MODULES.map(
      (slug) => ERP_DOMAIN_MODULE_KV_IDS[slug]
    );
    expect(new Set(kvValues).size).toBe(ERP_DOMAIN_MODULES.length);
    expect(ERP_DOMAIN_MODULE_KV_IDS.accounting).toBe("KV-ACCT");
    expect(ERP_DOMAIN_MODULE_KV_IDS.inventory).toBe("KV-INV");
  });
});
