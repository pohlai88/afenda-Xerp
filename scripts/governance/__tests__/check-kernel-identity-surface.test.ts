import { describe, expect, it } from "vitest";

import {
  checkKernelIdentitySurface,
  formatIdentitySurfaceViolations,
} from "../check-kernel-identity-surface.mts";
import { collectDirectBrandContractImportViolations } from "../identity/kernel-brand-barrel.governance.mts";

describe("check-kernel-identity-surface", () => {
  it("passes on the current repository state", () => {
    const violations = checkKernelIdentitySurface();
    expect(violations, formatIdentitySurfaceViolations(violations)).toEqual([]);
  });

  it("includes no direct-brand-contract-import violations on the live kernel tree", () => {
    const violations = checkKernelIdentitySurface().filter(
      (violation) => violation.rule === "direct-brand-contract-import"
    );
    expect(violations, formatIdentitySurfaceViolations(violations)).toEqual([]);
  });

  it("wires direct-brand-contract-import through the exported barrel collector", () => {
    const violations = collectDirectBrandContractImportViolations([
      {
        path: "packages/kernel/src/identity/primitives/locale-code.contract.ts",
        source: 'import { unbrand } from "../brand/brand.contract.js";',
      },
    ]);

    expect(violations).toMatchObject([
      { rule: "direct-brand-contract-import" },
    ]);
  });

  it("includes no primitive-module-layout-drift violations on the live tree", () => {
    const violations = checkKernelIdentitySurface().filter(
      (violation) => violation.rule === "primitive-module-layout-drift"
    );
    expect(violations, formatIdentitySurfaceViolations(violations)).toEqual([]);
  });
});
