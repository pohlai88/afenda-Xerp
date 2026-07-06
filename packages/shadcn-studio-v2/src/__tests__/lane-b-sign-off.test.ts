import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { assertSliceDocumentsComplete } from "./helpers/lane-slice-doc-status";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const SLICES_ROOT = path.join(DOCS_ROOT, "slices");

const LANE_B_SLICE_FILES = [
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
  "LANE-B-14-LANE-B-SYNCHRONIZATION-GATE.md",
  "LANE-B-15-V1-FORMAL-DEPRECATION-SIGN-OFF.md",
] as const;

describe("Lane B-15 v1 formal deprecation sign-off gate", () => {
  it("records PROCEED for Lane B and marks the v1 migration program complete", () => {
    const migrationMap = readFileSync(
      path.join(DOCS_ROOT, "MIGRATION-MAP.md"),
      "utf8"
    );
    const laneBIndex = readFileSync(
      path.join(SLICES_ROOT, "LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md"),
      "utf8"
    );
    const signOffSlice = readFileSync(
      path.join(SLICES_ROOT, "LANE-B-15-V1-FORMAL-DEPRECATION-SIGN-OFF.md"),
      "utf8"
    );

    expect(migrationMap).toContain("Lane B sign-off");
    expect(migrationMap).toContain("**PROCEED**");
    expect(migrationMap).toContain("Lane B program **Complete**");
    expect(migrationMap).toContain("**retired**");

    expect(laneBIndex).toMatch(/B-15[^\n]*\*\*Complete\*\*/u);
    expect(laneBIndex).toContain("Lane B program **Complete**");

    expect(signOffSlice).toMatch(/Status: \*\*Complete\*\*/u);
    expect(signOffSlice).toContain("**PROCEED**");
  });

  it("marks every Lane B slice document complete through B-15", () => {
    assertSliceDocumentsComplete(SLICES_ROOT, LANE_B_SLICE_FILES);
  });

  it("names v2 as sole ERP presentation chain in ADR authority", () => {
    const adr0027 = readFileSync(
      path.join(REPO_ROOT, "docs/adr/ADR-0027-frontend-presentation-reset.md"),
      "utf8"
    );
    const adr0040 = readFileSync(
      path.join(
        REPO_ROOT,
        "docs/adr/ADR-0040-promote-shadcn-studio-v2-and-deprecate-legacy.md"
      ),
      "utf8"
    );

    expect(adr0040).toMatch(/\*\*Status\*\* \| Accepted/u);
    expect(adr0040).toContain("@afenda/shadcn-studio-v2");
    expect(adr0027).toContain("@afenda/shadcn-studio-v2");
    expect(adr0027).toContain("ADR-0040");
  });

  it("retires v1 in foundation disposition and promotes v2 presentation owner", () => {
    const registry = readFileSync(
      path.join(
        REPO_ROOT,
        "packages/architecture-authority/src/data/foundation-disposition.registry.ts"
      ),
      "utf8"
    );
    const foundationDoc = readFileSync(
      path.join(REPO_ROOT, "docs/architecture/foundation-disposition.md"),
      "utf8"
    );

    expect(registry).toMatch(
      /id: "PKGR05A_SHADCN_STUDIO"[\s\S]*?lane: "archive-lane"/u
    );
    expect(registry).toMatch(
      /id: "PKGR05C_SHADCN_STUDIO_V2"[\s\S]*?lane: "green-lane"/u
    );
    expect(registry).toContain("@afenda/shadcn-studio-v2");

    expect(foundationDoc).toMatch(
      /PKGR05A_SHADCN_STUDIO[^\n]*archive-lane[^\n]*retired/u
    );
    expect(foundationDoc).toContain("PKGR05C_SHADCN_STUDIO_V2");
  });

  it("documents zero consumer v1 imports at formal deprecation", () => {
    const signOffSlice = readFileSync(
      path.join(SLICES_ROOT, "LANE-B-15-V1-FORMAL-DEPRECATION-SIGN-OFF.md"),
      "utf8"
    );
    const migrationMap = readFileSync(
      path.join(DOCS_ROOT, "MIGRATION-MAP.md"),
      "utf8"
    );

    expect(signOffSlice).toContain("Consumer v1 imports: 0");
    expect(migrationMap).toContain("| **Total** | **0** |");
  });
});
