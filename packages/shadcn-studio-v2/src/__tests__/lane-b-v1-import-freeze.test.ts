import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertZeroV1ConsumerImportBaseline,
  readV1ConsumerImportBaseline,
} from "./helpers/v1-baseline-zero";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const ROOT_PACKAGE_JSON_PATH = path.join(REPO_ROOT, "package.json");
const SCAN_SCRIPT_PATH = path.join(
  PACKAGE_ROOT,
  "scripts",
  "scan-v1-consumer-imports.ts"
);
const B13_SLICE_PATH = path.join(
  DOCS_ROOT,
  "slices",
  "LANE-B-13-V1-IMPORT-FREEZE-AND-RETIREMENT-CANDIDATE.md"
);

const CONSUMER_PACKAGE_JSON_PATHS = [
  path.join(REPO_ROOT, "apps/erp/package.json"),
  path.join(REPO_ROOT, "apps/developer/package.json"),
  path.join(REPO_ROOT, "apps/storybook/package.json"),
] as const;

const V1_PACKAGE_JSON_PATH = path.join(
  REPO_ROOT,
  "packages/shadcn-studio/package.json"
);

describe("Lane B-13 v1 import freeze", () => {
  it("ratchets v1 consumer import baseline at zero", () => {
    const baseline = readV1ConsumerImportBaseline(PACKAGE_ROOT);
    assertZeroV1ConsumerImportBaseline(baseline);
    expect(baseline.imports).toEqual([]);
  });

  it("keeps scanner SSOT and repo CI wiring for v1 import freeze", () => {
    const scanScript = readFileSync(SCAN_SCRIPT_PATH, "utf8");
    const rootPackageJson = readFileSync(ROOT_PACKAGE_JSON_PATH, "utf8");

    expect(scanScript).toContain("scanV1ConsumerImports");
    expect(scanScript).toContain("compareImportsToBaseline");
    expect(rootPackageJson).toContain('"check:v1-consumer-imports"');
    expect(rootPackageJson).toContain(
      "pnpm --filter @afenda/shadcn-studio-v2 check:v1-consumer-imports"
    );
    expect(rootPackageJson).toMatch(
      /"quality:boundaries":\s*"[^"]*check:v1-consumer-imports/u
    );
  });

  it("removes v1 workspace dependency from consumer package.json files", () => {
    for (const packageJsonPath of CONSUMER_PACKAGE_JSON_PATHS) {
      const packageJson = readFileSync(packageJsonPath, "utf8");

      expect(
        packageJson,
        path.relative(REPO_ROOT, packageJsonPath)
      ).not.toContain('"@afenda/shadcn-studio"');
      expect(packageJson).toContain('"@afenda/shadcn-studio-v2"');
    }
  });

  it("retires v1 package filesystem after Slice D-1 housekeeping", () => {
    expect(existsSync(V1_PACKAGE_JSON_PATH)).toBe(false);
  });

  it("records B-13 slice completion and migration retirement-candidate status", () => {
    const slice = readFileSync(B13_SLICE_PATH, "utf8");
    const migrationMap = readFileSync(
      path.join(DOCS_ROOT, "MIGRATION-MAP.md"),
      "utf8"
    );

    expect(slice).toMatch(/Status: \*\*Complete\*\*/u);
    expect(slice).toContain("check:v1-consumer-imports");
    expect(migrationMap).toContain("retirement-candidate");
    expect(migrationMap).toContain("@afenda/shadcn-studio");
  });
});
