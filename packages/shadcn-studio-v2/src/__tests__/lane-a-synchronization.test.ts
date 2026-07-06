import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const SLICES_ROOT = path.join(DOCS_ROOT, "slices");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const LANE_A_COMPLETE_SLICE_FILES = [
  "LANE-A-01-KEBAB-STEM-NORMALIZATION.md",
  "LANE-A-02-WIDGET-MANIFEST-AND-EVIDENCE-ADAPTER.md",
  "LANE-A-03-AUTH-SHELL-PROOF-INTEGRATION.md",
  "LANE-A-04-PRIMITIVE-CONTRACT-FORM-CONTROLS.md",
  "LANE-A-05-PRIMITIVE-CONTRACT-OVERLAYS.md",
  "LANE-A-06-PRIMITIVE-CONTRACT-NAV-DATA.md",
  "LANE-A-07-QUARANTINE-PROMOTION-GOVERNANCE.md",
  "LANE-A-08-PROOF-ROUTE-STATE-MATRIX.md",
  "LANE-A-09-MANIFEST-WORKFLOW-KINDS.md",
] as const;

const PRIMITIVE_CONTRACT_TEST_FILES = [
  "primitive-baseline.test.ts",
  "primitive-api-consistency.test.ts",
  "primitive-extension.test.ts",
  "primitive-form-controls.test.ts",
  "primitive-overlays.test.ts",
  "primitive-nav-data.test.ts",
] as const;

const LANE_A_MIGRATION_MAP_MARKERS = [
  "Lane A internal stabilization",
  "Presentation state matrix",
  "quarantine-governance.test.ts",
  "workflow-board-host-mapping.ts",
  "test:primitives",
] as const;

const LANE_A_PROOF_ROUTE_MARKERS = [
  "V2ProofStateMatrix",
  "v2ProofStateMatrixMeta",
  "surface-visibility",
  "authShell",
] as const;

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

describe("Lane A-10 synchronization gate", () => {
  it("marks Lane A-01 through A-09 slices complete in slice documents", () => {
    for (const fileName of LANE_A_COMPLETE_SLICE_FILES) {
      const sliceDocument = readFileSync(
        path.join(SLICES_ROOT, fileName),
        "utf8"
      );

      expect(sliceDocument, fileName).toMatch(/Status: \*\*Complete\*\*/u);
    }
  });

  it("keeps Lane A index and slice README statuses aligned through A-09", () => {
    const laneAIndex = readFileSync(
      path.join(SLICES_ROOT, "LANE-A-INTERNAL-STABILIZATION-INDEX.md"),
      "utf8"
    );
    const sliceReadme = readFileSync(
      path.join(SLICES_ROOT, "README.md"),
      "utf8"
    );

    for (let index = 1; index <= 9; index += 1) {
      const sliceId = `A-0${index}`;

      expect(laneAIndex).toContain(sliceId);
      expect(laneAIndex).toMatch(
        new RegExp(`${sliceId}[^\\n]*\\|\\s*\\*\\*Complete\\*\\*`, "u")
      );
      expect(sliceReadme).toMatch(
        new RegExp(`${sliceId}[^\\n]*\\|\\s*Complete`, "u")
      );
    }
  });

  it("mirrors primitive contract tests in PRIMITIVE-API-CONSISTENCY.md", () => {
    const primitiveDoc = readFileSync(
      path.join(DOCS_ROOT, "PRIMITIVE-API-CONSISTENCY.md"),
      "utf8"
    );

    for (const testFile of PRIMITIVE_CONTRACT_TEST_FILES) {
      expect(primitiveDoc).toContain(testFile);
      expect(existsSync(path.join(SRC_ROOT, "__tests__", testFile))).toBe(true);
    }
  });

  it("keeps MIGRATION-MAP.md aligned to Lane A deliverables", () => {
    const migrationMap = readFileSync(
      path.join(DOCS_ROOT, "MIGRATION-MAP.md"),
      "utf8"
    );

    for (const marker of LANE_A_MIGRATION_MAP_MARKERS) {
      expect(migrationMap).toContain(marker);
    }
  });

  it("keeps taxonomy metadata and quarantine docs aligned to src/", () => {
    const taxonomy = readFileSync(path.join(DOCS_ROOT, "TAXONOMY.md"), "utf8");

    expect(taxonomy).toContain("workflow-board-host-mapping.ts");
    expect(taxonomy).toContain("inventory.baseline.json");
    expect(taxonomy).toContain("DEVELOPMENT-ROADMAP.md");
    expect(taxonomy).not.toContain("`ROADMAP.md`");

    expect(
      existsSync(
        path.join(
          SRC_ROOT,
          "metadata",
          "registries",
          "workflow-board-host-mapping.ts"
        )
      )
    ).toBe(true);
    expect(
      existsSync(
        path.join(
          SRC_ROOT,
          "components",
          "quarantine",
          "inventory.baseline.json"
        )
      )
    ).toBe(true);
  });

  it("keeps developer proof route fixtures aligned to migration ledger surfaces", () => {
    const fixtures = readRepoFile(
      "apps/developer/src/lib/v2-proof/fixtures.ts"
    );
    const proofRoute = readRepoFile(
      "apps/developer/src/app/design-system/v2-proof/_components/v2-proof-route.client.tsx"
    );

    for (const marker of LANE_A_PROOF_ROUTE_MARKERS) {
      expect(fixtures + proofRoute).toContain(marker);
    }

    expect(fixtures).toContain("V2_PROOF_STATE_MATRIX");
  });
});
