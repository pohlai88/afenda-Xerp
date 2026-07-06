import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  getWorkflowBoardHostMapping,
  listBoardHostedWorkflowSurfaces,
  WORKFLOW_BOARD_MANIFEST_DECISION,
  workflowBoardHostMappingRegistry,
} from "../metadata/registries/workflow-board-host-mapping";
import { resolveWorkflowBoardLayoutHint } from "../metadata/registries/workflow-board-manifest-resolution";
import {
  getWorkspaceBoardManifestByKind,
  listWorkspaceBoardManifestKinds,
} from "../metadata/registries/workspace-board-manifest-registry";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const B10_SLICE_PATH = path.join(
  PACKAGE_ROOT,
  "docs",
  "slices",
  "LANE-B-10-MANIFEST-WORKFLOW-KIND-PROMOTION.md"
);
const A09_SLICE_PATH = path.join(
  PACKAGE_ROOT,
  "docs",
  "slices",
  "LANE-A-09-MANIFEST-WORKFLOW-KINDS.md"
);

describe("Lane B-10 manifest workflow kind promotion", () => {
  it("records Complete B-10 slice after B-09 board proof", () => {
    const slice = readFileSync(B10_SLICE_PATH, "utf8");

    expect(slice).toContain("Status: **Complete**");
    expect(slice).toContain("workflow-table");
    expect(slice).toContain("workflow-approval");
  });

  it("lifts A-09 Option A HOLD to LIFTED with canonical manifest kinds", () => {
    expect(WORKFLOW_BOARD_MANIFEST_DECISION.status).toBe("LIFTED");
    expect(WORKFLOW_BOARD_MANIFEST_DECISION.liftedBy).toBe("LANE-B-10");

    const a09 = readFileSync(A09_SLICE_PATH, "utf8");
    expect(a09).toContain("HOLD lifted");
    expect(a09).toContain("workflow-table");
  });

  it("registers workflow-table and workflow-approval manifest rows with ADR grid defaults", () => {
    expect(listWorkspaceBoardManifestKinds()).toEqual([
      "metric",
      "evidence",
      "workflow-table",
      "workflow-approval",
    ]);

    const table = getWorkspaceBoardManifestByKind("workflow-table");
    const approval = getWorkspaceBoardManifestByKind("workflow-approval");

    expect(table).toMatchObject({
      category: "table",
      defaultSize: { h: 4, w: 12 },
      minSize: { h: 2, w: 6 },
    });
    expect(approval).toMatchObject({
      category: "approval",
      defaultSize: { h: 3, w: 4 },
      minSize: { h: 2, w: 3 },
    });
  });

  it("wires board-hosted surfaces to manifest kinds in host mapping", () => {
    for (const surface of listBoardHostedWorkflowSurfaces()) {
      const mapping = getWorkflowBoardHostMapping(surface);
      expect(mapping?.manifestKind).not.toBeNull();
      expect(
        getWorkspaceBoardManifestByKind(mapping?.manifestKind ?? "")
      ).toBeDefined();
    }

    expect(getWorkflowBoardHostMapping("data-table-surface")).toMatchObject({
      boardCategory: "table",
      manifestKind: "workflow-table",
      gridDefault: { h: 4, w: 12 },
    });
    expect(getWorkflowBoardHostMapping("form-surface")).toMatchObject({
      boardCategory: "approval",
      manifestKind: "workflow-approval",
      gridDefault: { h: 3, w: 4 },
    });
  });

  it("resolves layout hints from manifest kind with category shim fallback", () => {
    const tableHint = resolveWorkflowBoardLayoutHint("data-table-surface");
    const formHint = resolveWorkflowBoardLayoutHint("form-surface");

    expect(tableHint).toMatchObject({
      source: "manifest-kind",
      kind: "workflow-table",
      manifestKind: "workflow-table",
      defaultSize: { h: 4, w: 12 },
    });
    expect(formHint).toMatchObject({
      source: "manifest-kind",
      kind: "workflow-approval",
      manifestKind: "workflow-approval",
      defaultSize: { h: 3, w: 4 },
    });

    for (const mapping of workflowBoardHostMappingRegistry) {
      if (!mapping.boardHosted) {
        expect(mapping.manifestKind).toBeNull();
      }
    }
  });
});
