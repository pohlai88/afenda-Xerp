import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const DEVELOPER_SRC_ROOT = path.join(REPO_ROOT, "apps/developer/src");
const DEVELOPER_PACKAGE_JSON_PATH = path.join(
  REPO_ROOT,
  "apps/developer/package.json"
);
const DEVELOPER_NEXT_CONFIG_PATH = path.join(
  REPO_ROOT,
  "apps/developer/next.config.ts"
);
const PRESENTATION_RUNTIME_CHECK_PATH = path.join(
  REPO_ROOT,
  "apps/developer/scripts/check-developer-presentation-runtime.mjs"
);
const B12_SLICE_PATH = path.join(
  DOCS_SLICES_ROOT,
  "LANE-B-12-DEVELOPER-LAB-V1-REMOVAL.md"
);

const FORBIDDEN_V1_IMPORT =
  /from\s+["']@afenda\/shadcn-studio(?:\/(?!v2)|["'])/u;

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (/\.(?:mjs|[jt]sx?)$/u.test(entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("Lane B-12 developer lab v1 dependency removal", () => {
  it("has zero v1 imports under apps/developer/src", () => {
    const files = collectSourceFiles(DEVELOPER_SRC_ROOT);

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, path.relative(REPO_ROOT, file)).not.toMatch(
        FORBIDDEN_V1_IMPORT
      );
    }
  });

  it("removes v1 from developer package.json and next.config transpile list", () => {
    const packageJson = readFileSync(DEVELOPER_PACKAGE_JSON_PATH, "utf8");
    const nextConfig = readFileSync(DEVELOPER_NEXT_CONFIG_PATH, "utf8");

    expect(packageJson).not.toContain('"@afenda/shadcn-studio"');
    expect(packageJson).toContain('"@afenda/shadcn-studio-v2"');
    expect(nextConfig).toContain("@afenda/shadcn-studio-v2");
    expect(nextConfig).not.toMatch(FORBIDDEN_V1_IMPORT);
  });

  it("enforces B-12 v1 removal in developer presentation runtime check", () => {
    const check = readFileSync(PRESENTATION_RUNTIME_CHECK_PATH, "utf8");

    expect(check).toContain("Lane B-12");
    expect(check).toContain(
      "package.json must not depend on @afenda/shadcn-studio"
    );
  });

  it("records B-12 slice completion", () => {
    const slice = readFileSync(B12_SLICE_PATH, "utf8");

    expect(slice).toContain("Status: **Complete**");
    expect(slice).toContain("DataTableSurface");
    expect(slice).toContain("MetricWidget");
  });
});
