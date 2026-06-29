import { describe, expect, it } from "vitest";

import {
  ERP_DOMAIN_LAYOUT_POLICY,
  ERP_DOMAIN_MODULE_MATURITY,
  ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS,
  ERP_DOMAIN_MODULES,
} from "../../../packages/kernel/src/erp-domain/erp-domain-layout.contract.ts";
import {
  checkErpDomainLayout,
  ERP_DOMAIN_LAYOUT_GATE_FAILURE_MATRIX,
} from "../check-erp-domain-layout.mts";

describe("check-erp-domain-layout gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkErpDomainLayout();

    expect(violations).toEqual([]);
  });

  it("registers 28 catalog slugs with all modules delivered", () => {
    expect(ERP_DOMAIN_MODULES).toHaveLength(28);
    expect(
      ERP_DOMAIN_MODULES.filter(
        (slug) => ERP_DOMAIN_MODULE_MATURITY[slug] === "delivered"
      )
    ).toHaveLength(28);
    expect(
      ERP_DOMAIN_MODULES.filter(
        (slug) => ERP_DOMAIN_MODULE_MATURITY[slug] === "catalog-only"
      )
    ).toHaveLength(0);
  });

  it("exports layout policy with PAS-001B gate name", () => {
    expect(ERP_DOMAIN_LAYOUT_POLICY.pas001bId).toBe("PAS-001B");
    expect(ERP_DOMAIN_LAYOUT_POLICY.layoutGate).toBe(
      "pnpm check:erp-domain-layout"
    );
    expect(ERP_DOMAIN_LAYOUT_POLICY.deliveredModuleCount).toBe(28);
    expect(ERP_DOMAIN_LAYOUT_POLICY.catalogExpectedCount).toBe(28);
  });

  it("defines scope disambiguation for supply-chain and document slugs", () => {
    expect(ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS["supply-chain"]).toContain(
      "fulfillment orchestration"
    );
    expect(ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS.document).toContain(
      "business document"
    );
  });

  it("mirrors the 11-point PAS-001B failure matrix", () => {
    expect(ERP_DOMAIN_LAYOUT_GATE_FAILURE_MATRIX).toHaveLength(11);
  });
});
