import { describe, expect, it } from "vitest";

import {
  ALLOWED_DIRECT_BRAND_CONTRACT_IMPORT_PATHS,
  collectDirectBrandContractImportViolations,
  isAllowedDirectBrandContractImportPath,
} from "../identity/kernel-brand-barrel.governance.mts";

describe("direct-brand-contract-import (PAS-001 §4.1.2)", () => {
  it("allows only the brand barrel and contract definition paths", () => {
    expect(ALLOWED_DIRECT_BRAND_CONTRACT_IMPORT_PATHS).toEqual([
      "packages/kernel/src/identity/brand/index.ts",
      "packages/kernel/src/identity/brand/brand.contract.ts",
    ]);
    expect(
      isAllowedDirectBrandContractImportPath(
        "packages/kernel/src/identity/brand/index.ts"
      )
    ).toBe(true);
    expect(
      isAllowedDirectBrandContractImportPath(
        "packages/kernel/src/identity/families/define-enterprise-family.ts"
      )
    ).toBe(false);
  });

  it("flags direct brand.contract.js imports outside the brand barrel", () => {
    const violations = collectDirectBrandContractImportViolations([
      {
        path: "packages/kernel/src/identity/families/define-enterprise-family.ts",
        source:
          'import { type Brand, unbrand } from "../brand/brand.contract.js";',
      },
    ]);

    expect(violations).toMatchObject([
      {
        rule: "direct-brand-contract-import",
        file: "packages/kernel/src/identity/families/define-enterprise-family.ts",
        message:
          "Import Brand/unbrand via identity/brand/index.js — direct brand.contract.js imports bypass the barrel",
      },
    ]);
  });

  it("allows brand/index.ts to re-export from brand.contract.js", () => {
    const violations = collectDirectBrandContractImportViolations([
      {
        path: "packages/kernel/src/identity/brand/index.ts",
        source: 'export { type Brand, unbrand } from "./brand.contract.js";',
      },
    ]);

    expect(violations).toEqual([]);
  });

  it("allows kernel modules that import via brand/index.js barrel", () => {
    const violations = collectDirectBrandContractImportViolations([
      {
        path: "packages/kernel/src/identity/families/define-enterprise-family.ts",
        source: 'import { type Brand, unbrand } from "../brand/index.js";',
      },
      {
        path: "packages/kernel/src/erp-domain/accounting/accounting-id.contract.ts",
        source: 'import type { Brand } from "../../identity/brand/index.js";',
      },
    ]);

    expect(violations).toEqual([]);
  });

  it("flags relative and absolute-style brand.contract paths", () => {
    const violations = collectDirectBrandContractImportViolations([
      {
        path: "packages/kernel/src/identity/wire/identity-wire.contract.ts",
        source: 'import type { Brand } from "../brand/brand.contract";',
      },
    ]);

    expect(violations).toHaveLength(1);
    expect(violations[0]?.rule).toBe("direct-brand-contract-import");
  });
});
