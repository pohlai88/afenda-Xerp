import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const DOCS_ROOT = path.join(PACKAGE_ROOT, "docs");
const SLICES_ROOT = path.join(DOCS_ROOT, "slices");

const LANE_A_SLICE_FILES = [
  "LANE-A-01-KEBAB-STEM-NORMALIZATION.md",
  "LANE-A-02-WIDGET-MANIFEST-AND-EVIDENCE-ADAPTER.md",
  "LANE-A-03-AUTH-SHELL-PROOF-INTEGRATION.md",
  "LANE-A-04-PRIMITIVE-CONTRACT-FORM-CONTROLS.md",
  "LANE-A-05-PRIMITIVE-CONTRACT-OVERLAYS.md",
  "LANE-A-06-PRIMITIVE-CONTRACT-NAV-DATA.md",
  "LANE-A-07-QUARANTINE-PROMOTION-GOVERNANCE.md",
  "LANE-A-08-PROOF-ROUTE-STATE-MATRIX.md",
  "LANE-A-09-MANIFEST-WORKFLOW-KINDS.md",
  "LANE-A-10-SYNCHRONIZATION-GATE.md",
  "LANE-A-11-INTERNAL-SIGN-OFF-GATE.md",
] as const;

describe("Lane A-11 internal sign-off gate", () => {
  it("records PROCEED for Lane A and unlocks Lane B planning only", () => {
    const migrationMap = readFileSync(
      path.join(DOCS_ROOT, "MIGRATION-MAP.md"),
      "utf8"
    );
    const laneAIndex = readFileSync(
      path.join(SLICES_ROOT, "LANE-A-INTERNAL-STABILIZATION-INDEX.md"),
      "utf8"
    );
    const signOffSlice = readFileSync(
      path.join(SLICES_ROOT, "LANE-A-11-INTERNAL-SIGN-OFF-GATE.md"),
      "utf8"
    );

    expect(migrationMap).toContain("Lane A sign-off");
    expect(migrationMap).toContain("**PROCEED**");
    expect(migrationMap).toContain("approved-for-planning");
    expect(migrationMap).not.toContain("Lane B remains **blocked** until A-11");

    expect(laneAIndex).toMatch(/A-11[^\n]*\*\*Complete\*\*/u);
    expect(signOffSlice).toMatch(/Status: \*\*Complete\*\*/u);
    expect(signOffSlice).toContain("`PROCEED`");
  });

  it("marks every Lane A slice document complete", () => {
    for (const fileName of LANE_A_SLICE_FILES) {
      const sliceDocument = readFileSync(
        path.join(SLICES_ROOT, fileName),
        "utf8"
      );

      expect(sliceDocument, fileName).toMatch(/Status: \*\*Complete\*\*/u);
    }
  });

  it("documents explicit Lane B execution blockers that remain after sign-off", () => {
    const migrationMap = readFileSync(
      path.join(DOCS_ROOT, "MIGRATION-MAP.md"),
      "utf8"
    );
    const signOffSlice = readFileSync(
      path.join(SLICES_ROOT, "LANE-A-11-INTERNAL-SIGN-OFF-GATE.md"),
      "utf8"
    );

    for (const blocker of [
      "v1 package retirement",
      "ERP broad surface migration",
      "Workflow manifest",
    ]) {
      expect(migrationMap + signOffSlice).toContain(blocker);
    }
  });
});
