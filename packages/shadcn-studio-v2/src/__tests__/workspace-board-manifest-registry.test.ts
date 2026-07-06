import { readdirSync, readFileSync } from "node:fs";
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
  workspaceBoardManifestRegistry,
} from "../metadata/registries/workspace-board-manifest-registry";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(TEST_DIR, "..");

describe("workspace board manifest registry", () => {
  it("keeps manifest rows JSON-serializable", () => {
    expect(JSON.parse(JSON.stringify(workspaceBoardManifestRegistry))).toEqual(
      workspaceBoardManifestRegistry
    );
  });

  it("registers metric, evidence, and workflow kinds with ADR grid defaults", () => {
    expect(listWorkspaceBoardManifestKinds()).toEqual([
      "metric",
      "evidence",
      "workflow-table",
      "workflow-approval",
    ]);

    const metric = getWorkspaceBoardManifestByKind("metric");
    const evidence = getWorkspaceBoardManifestByKind("evidence");
    const workflowTable = getWorkspaceBoardManifestByKind("workflow-table");
    const workflowApproval = getWorkspaceBoardManifestByKind("workflow-approval");

    expect(metric?.category).toBe("metric");
    expect(metric?.defaultSize).toEqual({ h: 2, w: 2 });

    expect(evidence?.category).toBe("evidence");
    expect(evidence?.defaultSize).toEqual({ h: 3, w: 4 });
    expect(evidence?.minSize).toEqual({ h: 2, w: 2 });

    expect(workflowTable?.category).toBe("table");
    expect(workflowTable?.defaultSize).toEqual({ h: 4, w: 12 });
    expect(workflowTable?.minSize).toEqual({ h: 2, w: 6 });

    expect(workflowApproval?.category).toBe("approval");
    expect(workflowApproval?.defaultSize).toEqual({ h: 3, w: 4 });
    expect(workflowApproval?.minSize).toEqual({ h: 2, w: 3 });
  });

  it("aligns adapter kinds with exported widget components", () => {
    const metricSource = readFileSync(
      path.join(SRC_ROOT, "views", "widgets", "widget-metric.tsx"),
      "utf8"
    );
    const evidenceSource = readFileSync(
      path.join(SRC_ROOT, "views", "widgets", "widget-evidence.tsx"),
      "utf8"
    );

    for (const kind of ["metric", "evidence"] as const) {
      expect(getWorkspaceBoardManifestByKind(kind)?.kind).toBe(kind);
    }

    expect(metricSource).toContain('data-adapter-kind="metric"');
    expect(evidenceSource).toContain('data-adapter-kind="evidence"');
  });
});

describe("Lane A-09 workflow board host mapping (B-10 lifted)", () => {
  it("records Option A LIFTED with canonical manifest kind rows", () => {
    expect(WORKFLOW_BOARD_MANIFEST_DECISION.option).toBe("A");
    expect(WORKFLOW_BOARD_MANIFEST_DECISION.status).toBe("LIFTED");
    expect(WORKFLOW_BOARD_MANIFEST_DECISION.liftedBy).toBe("LANE-B-10");

    for (const mapping of workflowBoardHostMappingRegistry) {
      if (mapping.boardHosted) {
        expect(mapping.manifestKind).not.toBeNull();
        continue;
      }

      expect(mapping.manifestKind).toBeNull();
    }

    expect(listWorkspaceBoardManifestKinds()).toContain("workflow-table");
    expect(listWorkspaceBoardManifestKinds()).toContain("workflow-approval");
  });

  it("maps board-hosted workflow surfaces to manifest kinds and categories", () => {
    expect(
      JSON.parse(JSON.stringify(workflowBoardHostMappingRegistry))
    ).toEqual(workflowBoardHostMappingRegistry);

    expect(getWorkflowBoardHostMapping("data-table-surface")).toMatchObject({
      boardCategory: "table",
      boardHosted: true,
      gridDefault: { h: 4, w: 12 },
      manifestKind: "workflow-table",
      viewExport: "DataTableSurface",
    });

    expect(getWorkflowBoardHostMapping("form-surface")).toMatchObject({
      boardCategory: "approval",
      boardHosted: true,
      gridDefault: { h: 3, w: 4 },
      manifestKind: "workflow-approval",
      viewExport: "FormSurface",
    });

    expect(listBoardHostedWorkflowSurfaces()).toEqual([
      "data-table-surface",
      "form-surface",
    ]);
  });

  it("resolves layout hints from manifest kinds via dual-read helper", () => {
    const tableHint = resolveWorkflowBoardLayoutHint("data-table-surface");
    const formHint = resolveWorkflowBoardLayoutHint("form-surface");

    expect(tableHint?.source).toBe("manifest-kind");
    expect(tableHint?.kind).toBe("workflow-table");
    expect(formHint?.source).toBe("manifest-kind");
    expect(formHint?.kind).toBe("workflow-approval");
  });

  it("keeps a single workspace board manifest registry file", () => {
    const registriesDir = path.join(SRC_ROOT, "metadata", "registries");
    const manifestRegistryFiles = readdirSync(registriesDir).filter((name) =>
      name.endsWith("-manifest-registry.ts")
    );

    expect(manifestRegistryFiles).toEqual([
      "workspace-board-manifest-registry.ts",
    ]);
  });
});
