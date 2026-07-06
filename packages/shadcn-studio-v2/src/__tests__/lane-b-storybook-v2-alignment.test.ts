import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { assertNoV1ConsumerImport } from "./helpers/forbidden-v1-import-patterns";
import { assertSliceDocumentComplete } from "./helpers/lane-slice-doc-status";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");

const STORYBOOK_ROOT = path.join(REPO_ROOT, "apps/storybook");
const STORYBOOK_PACKAGE_JSON_PATH = path.join(
  REPO_ROOT,
  "apps/storybook/package.json"
);
const B11_SLICE_PATH = path.join(
  DOCS_SLICES_ROOT,
  "LANE-B-11-STORYBOOK-V2-ALIGNMENT.md"
);

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (entry === "node_modules" || entry === "storybook-static") {
        continue;
      }

      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (/\.(?:mjs|[jt]sx?|css)$/u.test(entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("Lane B-11 Storybook v2 alignment", () => {
  it("has zero v1 imports under apps/storybook", () => {
    const files = collectSourceFiles(STORYBOOK_ROOT);

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const label = path.relative(REPO_ROOT, file);
      assertNoV1ConsumerImport(source, label);
      expect(source, label).not.toContain('"@afenda/shadcn-studio"');
      expect(source, path.relative(REPO_ROOT, file)).not.toContain(
        "@afenda/shadcn-studio/shadcn-default.css"
      );
      expect(source, path.relative(REPO_ROOT, file)).not.toContain(
        "@afenda/shadcn-studio/lab"
      );
    }
  });

  it("depends on v2 in storybook package.json", () => {
    const packageJson = readFileSync(STORYBOOK_PACKAGE_JSON_PATH, "utf8");

    expect(packageJson).not.toContain('"@afenda/shadcn-studio"');
    expect(packageJson).toContain('"@afenda/shadcn-studio-v2"');
  });

  it("exports Storybook lab surface from v2 package", () => {
    const labExport = readFileSync(
      path.join(PACKAGE_ROOT, "package.json"),
      "utf8"
    );
    const labBoundary = readFileSync(
      path.join(PACKAGE_ROOT, "src/storybook/lab.ts"),
      "utf8"
    );

    expect(labExport).toContain('"./lab"');
    expect(labBoundary).toContain("shadcnStudioThemeDecorator");
    expect(labBoundary).toContain("ErpWorkspaceDashboardPageSample");
    assertNoV1ConsumerImport(labBoundary);
  });

  it("records B-11 slice completion", () => {
    const slice = readFileSync(B11_SLICE_PATH, "utf8");

    assertSliceDocumentComplete(
      DOCS_SLICES_ROOT,
      "LANE-B-11-STORYBOOK-V2-ALIGNMENT.md"
    );
    expect(slice).toContain("AppShell01");
    expect(slice).toContain("MetricWidget");
  });
});
