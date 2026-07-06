import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const ERP_GLOBALS_PATH = path.join(REPO_ROOT, "apps/erp/src/app/globals.css");
const B03_SLICE_PATH = path.join(
  DOCS_SLICES_ROOT,
  "LANE-B-03-ERP-THEME-CSS-V2-CHAIN.md"
);

const V1_PRESENTATION_CSS_PATTERN =
  /@import\s+["']@afenda\/shadcn-studio(?:\/|["'])/u;
const V2_DEFAULT_CSS = "@afenda/shadcn-studio-v2/shadcn-default.css";
const V2_BRAND_CSS = "@afenda/shadcn-studio-v2/themes/afenda-brand.css";

describe("Lane B-03 ERP theme and CSS v2 chain", () => {
  it("imports presentation CSS from v2 package dist exports only", () => {
    const globals = readFileSync(ERP_GLOBALS_PATH, "utf8");

    expect(globals).toContain(V2_DEFAULT_CSS);
    expect(globals).toContain(V2_BRAND_CSS);
    expect(globals).not.toMatch(V1_PRESENTATION_CSS_PATTERN);
    expect(globals).not.toContain("packages/shadcn-studio-v2/src/styles");
    expect(globals).toContain(
      '@source "../../../../packages/shadcn-studio-v2/src/**/*.{ts,tsx}"'
    );
  });

  it("records B-03 slice completion with v2-only ERP CSS chain", () => {
    const slice = readFileSync(B03_SLICE_PATH, "utf8");

    expect(slice).toContain("Status: **Complete**");
    expect(slice).toContain(V2_DEFAULT_CSS);
    expect(slice).toContain("check:package-css-dist-sync");
  });
});
