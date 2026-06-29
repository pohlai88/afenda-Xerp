import { describe, expect, it } from "vitest";
import { KERNEL_PACKAGE_SUBPATH_EXPORTS } from "../../../packages/kernel/src/contracts/kernel-package-layout.contract.ts";
import {
  checkKernelPackageStructure,
  formatKernelPackageStructureViolations,
} from "../check-kernel-package-structure.mts";

describe("check-kernel-package-structure", () => {
  it("passes on the current repository state", () => {
    const violations = checkKernelPackageStructure();

    expect(
      violations,
      formatKernelPackageStructureViolations(violations)
    ).toEqual([]);
  });

  it("aligns layout contract subpath exports with PAS §6.4 registry", () => {
    expect(KERNEL_PACKAGE_SUBPATH_EXPORTS).toEqual([
      "./context",
      "./erp-domain/accounting",
      "./erp-domain/catalog",
      "./propagation",
      "./events",
      "./policy",
      "./permission",
      "./governance",
    ]);
  });
});
