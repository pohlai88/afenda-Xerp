import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findErpCouplingViolations } from "./helpers/docs-import-scan";

const scanRoots = [join(process.cwd(), "src"), join(process.cwd(), "content")];

describe("@afenda/docs no ERP runtime coupling", () => {
  it("does not import apps/erp paths or @afenda/erp package", () => {
    expect(findErpCouplingViolations(scanRoots)).toEqual([]);
  });
});
