import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  findBannedRuntimeImportViolations,
  findErpCouplingViolations,
} from "./helpers/docs-import-scan";

const docsRoot = join(process.cwd());
const scanRoots = [join(docsRoot, "src"), join(docsRoot, "content")] as const;

describe("@afenda/docs no ERP runtime coupling", () => {
  it("does not import @afenda/erp in docs app source or content", () => {
    expect(findErpCouplingViolations(scanRoots)).toEqual([]);
  });
});

describe("@afenda/docs no afenda runtime imports", () => {
  it("does not import banned @afenda/* runtime packages", () => {
    expect(findBannedRuntimeImportViolations(scanRoots)).toEqual([]);
  });

  it("allows dev-only @afenda/typescript-config in package.json only", () => {
    const pkgJson = readFileSync(join(docsRoot, "package.json"), "utf8");
    expect(pkgJson).toContain("@afenda/typescript-config");
  });
});
