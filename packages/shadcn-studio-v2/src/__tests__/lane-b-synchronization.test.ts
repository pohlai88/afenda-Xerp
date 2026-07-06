import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { assertSliceDocumentsComplete } from "./helpers/lane-slice-doc-status";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const SLICES_ROOT = path.join(DOCS_ROOT, "slices");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const LANE_B_COMPLETE_SLICE_FILES = [
  "LANE-B-01-CONSUMER-IMPORT-INVENTORY.md",
  "LANE-B-02-ADR-DRAG-LIBRARY-AND-BOARD-FRAME.md",
  "LANE-B-03-ERP-THEME-CSS-V2-CHAIN.md",
  "LANE-B-04-DEVELOPER-LAB-SHELL-CUTOVER.md",
  "LANE-B-05-TANSTACK-DATATABLE-COMPOSER.md",
  "LANE-B-06-ERP-APP-SHELL-NAV-CUTOVER.md",
  "LANE-B-07-ERP-SURFACE-WAVE-SYSTEM-ADMIN.md",
  "LANE-B-07-EXT-ERP-SURFACE-WAVE-2.md",
  "LANE-B-08-ERP-SURFACE-WAVE-METADATA-PROCUREMENT.md",
  "LANE-B-09-WORKFLOW-BOARD-RUNTIME.md",
  "LANE-B-10-MANIFEST-WORKFLOW-KIND-PROMOTION.md",
  "LANE-B-11-STORYBOOK-V2-ALIGNMENT.md",
  "LANE-B-12-DEVELOPER-LAB-V1-REMOVAL.md",
  "LANE-B-13-V1-IMPORT-FREEZE-AND-RETIREMENT-CANDIDATE.md",
] as const;

const LANE_B_PROOF_TEST_FILES = [
  "lane-b-v1-import-baseline.test.ts",
  "lane-b-v1-import-freeze.test.ts",
  "lane-b-09-workflow-board-runtime.test.ts",
  "lane-b-10-manifest-workflow-kind-promotion.test.ts",
] as const;

const LANE_B_MIGRATION_MAP_MARKERS = [
  "Lane B — V1 / ERP migration",
  "check:v1-consumer-imports",
  "lane-b-v1-import-baseline.test.ts",
  "lane-b-v1-import-freeze.test.ts",
  "retirement-candidate",
  "apps/developer",
  "apps/erp",
  "apps/storybook",
  "**migrated**",
] as const;

const LANE_B_CONSUMER_APP_ROWS = [
  "| `apps/developer` |",
  "| `apps/erp` |",
  "| `apps/storybook` |",
] as const;

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

describe("Lane B-14 synchronization gate", () => {
  it("marks Lane B-01 through B-13 slices complete in slice documents", () => {
    assertSliceDocumentsComplete(SLICES_ROOT, LANE_B_COMPLETE_SLICE_FILES);
  });

  it("keeps Lane B index and slice README statuses aligned through B-13", () => {
    const laneBIndex = readFileSync(
      path.join(SLICES_ROOT, "LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md"),
      "utf8"
    );
    const sliceReadme = readFileSync(
      path.join(SLICES_ROOT, "README.md"),
      "utf8"
    );

    const sliceIds = [
      "B-01",
      "B-02",
      "B-03",
      "B-04",
      "B-05",
      "B-06",
      "B-07",
      "B-08",
      "B-09",
      "B-10",
      "B-11",
      "B-12",
      "B-13",
    ] as const;

    for (const sliceId of sliceIds) {
      expect(laneBIndex).toContain(sliceId);
      expect(laneBIndex).toMatch(
        new RegExp(`${sliceId}[^\\n]*\\|\\s*\\*\\*Complete\\*\\*`, "u")
      );
      expect(sliceReadme).toMatch(
        new RegExp(`${sliceId}[^\\n]*\\|\\s*Complete`, "u")
      );
    }

    expect(laneBIndex).toMatch(/B-07-ext[^\n]*\|\s*\*\*Complete\*\*/u);
  });

  it("keeps MIGRATION-MAP.md aligned to Lane B deliverables without deferred consumer rows", () => {
    const migrationMap = readFileSync(
      path.join(DOCS_ROOT, "MIGRATION-MAP.md"),
      "utf8"
    );

    for (const marker of LANE_B_MIGRATION_MAP_MARKERS) {
      expect(migrationMap).toContain(marker);
    }

    for (const row of LANE_B_CONSUMER_APP_ROWS) {
      const rowIndex = migrationMap.indexOf(row);
      expect(rowIndex, row).toBeGreaterThan(-1);

      const rowLine = migrationMap
        .slice(rowIndex, migrationMap.indexOf("\n", rowIndex))
        .trim();

      expect(rowLine, row).not.toContain("deferred");
      expect(rowLine, row).toMatch(/migrated|pilot-proven/u);
    }

    expect(migrationMap).not.toMatch(/\| `apps\/developer`[^\n]*deferred/u);
    expect(migrationMap).not.toMatch(/\| `apps\/erp`[^\n]*deferred/u);
    expect(migrationMap).not.toMatch(/\| `apps\/storybook`[^\n]*deferred/u);
  });

  it("wires B-13 v1 import freeze gate in repo CI and executable tests", () => {
    const rootPackageJson = readRepoFile("package.json");

    expect(rootPackageJson).toContain('"check:v1-consumer-imports"');
    expect(rootPackageJson).toContain(
      "pnpm --filter @afenda/shadcn-studio-v2 check:v1-consumer-imports"
    );

    for (const testFile of LANE_B_PROOF_TEST_FILES) {
      expect(existsSync(path.join(SRC_ROOT, "__tests__", testFile))).toBe(true);
    }

    expect(
      existsSync(
        path.join(
          PACKAGE_ROOT,
          "scripts",
          "lane-b",
          "v1-consumer-import.baseline.json"
        )
      )
    ).toBe(true);
  });

  it("keeps DEVELOPMENT-ROADMAP.md and Lane B index lifecycle aligned", () => {
    const roadmap = readFileSync(
      path.join(DOCS_ROOT, "DEVELOPMENT-ROADMAP.md"),
      "utf8"
    );
    const laneBIndex = readFileSync(
      path.join(SLICES_ROOT, "LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md"),
      "utf8"
    );

    expect(roadmap).toContain("Lane B");
    expect(roadmap).toContain("LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md");
    expect(roadmap).not.toContain(
      "B-03 ERP CSS v2 chain; B-06 ERP shell/nav cutover"
    );
    expect(laneBIndex).toContain("B-14");
    expect(laneBIndex).toMatch(/B-14[^\n]*\*\*Complete\*\*/u);
  });

  it("keeps workflow board runtime and manifest kinds aligned to src/", () => {
    const mappingSource = readFileSync(
      path.join(
        SRC_ROOT,
        "metadata",
        "registries",
        "workflow-board-host-mapping.ts"
      ),
      "utf8"
    );
    const erpBoardCanvas = readRepoFile(
      "apps/erp/src/components/workspace/workspace-board-canvas.client.tsx"
    );

    expect(mappingSource).toContain("LANE-B-10");
    expect(mappingSource).toContain("workflow-table");
    expect(erpBoardCanvas).toContain("useContainerWidth");
    expect(erpBoardCanvas).toContain("react-grid-layout");
  });
});
