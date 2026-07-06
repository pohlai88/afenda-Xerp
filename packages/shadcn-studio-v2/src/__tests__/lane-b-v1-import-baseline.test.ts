import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildBaseline,
  compareImportsToBaseline,
  importEntryKey,
  resolveBaselinePath,
  scanV1ConsumerImports,
  type V1ConsumerImportBaseline,
} from "../../scripts/scan-v1-consumer-imports";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const BASELINE_PATH = resolveBaselinePath(PACKAGE_ROOT);

describe("Lane B-01 v1 consumer import baseline", () => {
  it("records zero v1 consumer imports after Wave 2 (B-07-ext + B-11 + B-12)", () => {
    const baseline = JSON.parse(
      readFileSync(BASELINE_PATH, "utf8")
    ) as V1ConsumerImportBaseline;

    expect(baseline.policy).toBe("LANE-B-01");
    expect(baseline.totals.all).toBe(0);
    expect(baseline.totals.developer).toBe(0);
    expect(baseline.totals.erp).toBe(0);
    expect(baseline.totals.storybook).toBe(0);
    expect(baseline.imports.length).toBe(0);
  });

  it(
    "matches the live workspace scan exactly (no new or removed v1 imports)",
    async () => {
      const baseline = JSON.parse(
        readFileSync(BASELINE_PATH, "utf8")
      ) as V1ConsumerImportBaseline;
      const current = await scanV1ConsumerImports(REPO_ROOT);
      const comparison = compareImportsToBaseline(current, baseline.imports);

      expect(
        comparison.newImports,
        comparison.newImports.map((entry) => importEntryKey(entry)).join("\n")
      ).toEqual([]);
      expect(
        comparison.missingFromBaseline,
        comparison.missingFromBaseline
          .map((entry) => importEntryKey(entry))
          .join("\n")
      ).toEqual([]);
    },
    60_000
  );

  it("documents B-01 completion in migration ledger and slice spec", () => {
    const migrationMap = readFileSync(
      path.join(DOCS_ROOT, "MIGRATION-MAP.md"),
      "utf8"
    );
    const slice = readFileSync(
      path.join(DOCS_ROOT, "slices", "LANE-B-01-CONSUMER-IMPORT-INVENTORY.md"),
      "utf8"
    );

    expect(migrationMap).toContain("Lane B-01");
    expect(migrationMap).toContain("v1-consumer-import.baseline.json");
    expect(slice).toMatch(/Status: \*\*Complete\*\*/u);
  });

  it("does not overlap drift guard scope (v2 package-only legacy ban)", () => {
    const driftSource = readFileSync(
      path.join(PACKAGE_ROOT, "scripts", "check-design-system-drift.ts"),
      "utf8"
    );

    expect(driftSource).toContain("checkV2RuntimeImports");
    expect(driftSource).not.toContain("scanV1ConsumerImports");
    expect(driftSource).toContain("legacy shadcn-studio package import");
  });
});

describe("Lane B-01 baseline builder", () => {
  it("sorts imports deterministically by path, line, and specifier", () => {
    const baseline = buildBaseline(
      [
        {
          consumer: "apps/erp/src",
          relativePath: "apps/erp/src/b.ts",
          line: 2,
          specifier: "@afenda/shadcn-studio",
          category: "unknown",
        },
        {
          consumer: "apps/erp/src",
          relativePath: "apps/erp/src/a.ts",
          line: 1,
          specifier: "@afenda/shadcn-studio/metadata",
          category: "metadata",
        },
      ],
      "2026-07-06"
    );

    expect(baseline.imports[0]?.relativePath).toBe("apps/erp/src/a.ts");
    expect(baseline.imports[1]?.relativePath).toBe("apps/erp/src/b.ts");
  });
});
