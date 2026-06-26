import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  checkPackageCssDistSync,
  findPackageForSourcePath,
  PACKAGE_CSS_DIST_PACKAGES,
  syncPackageCssDist,
} from "../package-css-dist-policy.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

describe("package-css-dist-policy", () => {
  it("maps appshell CSS sources to @afenda/appshell", () => {
    const pkg = findPackageForSourcePath(
      "packages/appshell/src/styles/afenda-appshell.css"
    );
    expect(pkg?.name).toBe("@afenda/appshell");
  });

  it("maps metadata-ui fixture CSS to @afenda/metadata-ui", () => {
    const pkg = findPackageForSourcePath(
      "packages/metadata-ui/src/fixtures/metadata-ui-fixtures.css"
    );
    expect(pkg?.name).toBe("@afenda/metadata-ui");
  });

  it("ignores non-package CSS paths", () => {
    expect(
      findPackageForSourcePath("apps/erp/src/app/(auth)/auth.css")
    ).toBeNull();
  });

  it("registers all three dist-sync packages", () => {
    expect(PACKAGE_CSS_DIST_PACKAGES.map((pkg) => pkg.name)).toEqual([
      "@afenda/appshell",
      "@afenda/ui",
      "@afenda/metadata-ui",
    ]);
  });

  it("passes dist sync check after syncing all packages", () => {
    syncPackageCssDist(repoRoot);
    const result = checkPackageCssDistSync(repoRoot);
    expect(result.ok, result.violations.join("\n")).toBe(true);
  });
});
