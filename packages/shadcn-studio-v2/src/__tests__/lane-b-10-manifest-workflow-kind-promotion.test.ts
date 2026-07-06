import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { WORKFLOW_BOARD_MANIFEST_DECISION } from "../metadata/registries/workflow-board-host-mapping";
import { assertSliceDocumentComplete } from "./helpers/lane-slice-doc-status";
import {
  assertLiftedWorkflowManifestDecision,
  assertWorkflowBoardHostMappings,
  assertWorkflowLayoutHintsFromManifestKind,
  assertWorkflowManifestKindsRegistered,
} from "./helpers/workflow-board-manifest-assertions";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SLICES_ROOT = path.join(PACKAGE_ROOT, "docs", "slices");
const B10_SLICE_PATH = path.join(
  SLICES_ROOT,
  "LANE-B-10-MANIFEST-WORKFLOW-KIND-PROMOTION.md"
);
const A09_SLICE_PATH = path.join(
  SLICES_ROOT,
  "LANE-A-09-MANIFEST-WORKFLOW-KINDS.md"
);

describe("Lane B-10 manifest workflow kind promotion", () => {
  it("records Complete B-10 slice after B-09 board proof", () => {
    const slice = readFileSync(B10_SLICE_PATH, "utf8");

    assertSliceDocumentComplete(
      SLICES_ROOT,
      "LANE-B-10-MANIFEST-WORKFLOW-KIND-PROMOTION.md"
    );
    expect(slice).toContain("workflow-table");
    expect(slice).toContain("workflow-approval");
  });

  it("lifts A-09 Option A HOLD to LIFTED with canonical manifest kinds", () => {
    assertLiftedWorkflowManifestDecision();
    expect(WORKFLOW_BOARD_MANIFEST_DECISION.liftedBy).toBe("LANE-B-10");

    const a09 = readFileSync(A09_SLICE_PATH, "utf8");
    expect(a09).toContain("HOLD lifted");
    expect(a09).toContain("workflow-table");
  });

  it("registers workflow-table and workflow-approval manifest rows with ADR grid defaults", () => {
    assertWorkflowManifestKindsRegistered();
  });

  it("wires board-hosted surfaces to manifest kinds in host mapping", () => {
    assertWorkflowBoardHostMappings();
  });

  it("resolves layout hints from manifest kind with category shim fallback", () => {
    assertWorkflowLayoutHintsFromManifestKind();
  });
});
