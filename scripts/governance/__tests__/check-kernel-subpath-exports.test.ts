import { describe, expect, it } from "vitest";

import {
  checkKernelSubpathExports,
  formatKernelSubpathExportViolations,
  PAS_64_REQUIRED_SUBPATHS,
} from "../check-kernel-subpath-exports.mts";

describe("check-kernel-subpath-exports", () => {
  it("passes on the current repository state", () => {
    const violations = checkKernelSubpathExports();

    expect(violations, formatKernelSubpathExportViolations(violations)).toEqual(
      []
    );
  });

  it("documents exactly eight PAS §6.4 subpath keys (B16 baseline)", () => {
    expect(Object.keys(PAS_64_REQUIRED_SUBPATHS)).toEqual([
      ".",
      "./context",
      "./erp-domain/accounting",
      "./propagation",
      "./events",
      "./policy",
      "./permission",
      "./governance",
    ]);
  });
});
