import { expect } from "vitest";
import {
  getWorkflowBoardHostMapping,
  listBoardHostedWorkflowSurfaces,
  WORKFLOW_BOARD_MANIFEST_DECISION,
  workflowBoardHostMappingRegistry,
} from "../../metadata/registries/workflow-board-host-mapping";
import { resolveWorkflowBoardLayoutHint } from "../../metadata/registries/workflow-board-manifest-resolution";
import {
  getWorkspaceBoardManifestByKind,
  listWorkspaceBoardManifestKinds,
} from "../../metadata/registries/workspace-board-manifest-registry";

export function assertWorkflowManifestKindsRegistered(): void {
  expect(listWorkspaceBoardManifestKinds()).toEqual([
    "metric",
    "evidence",
    "workflow-table",
    "workflow-approval",
  ]);

  expect(getWorkspaceBoardManifestByKind("workflow-table")).toMatchObject({
    category: "table",
    defaultSize: { h: 4, w: 12 },
    minSize: { h: 2, w: 6 },
  });
  expect(getWorkspaceBoardManifestByKind("workflow-approval")).toMatchObject({
    category: "approval",
    defaultSize: { h: 3, w: 4 },
    minSize: { h: 2, w: 3 },
  });
}

export function assertWorkflowBoardHostMappings(): void {
  for (const surface of listBoardHostedWorkflowSurfaces()) {
    const mapping = getWorkflowBoardHostMapping(surface);
    expect(mapping?.manifestKind).not.toBeNull();
    expect(
      getWorkspaceBoardManifestByKind(mapping?.manifestKind ?? "")
    ).toBeDefined();
  }

  expect(getWorkflowBoardHostMapping("data-table-surface")).toMatchObject({
    boardCategory: "table",
    boardHosted: true,
    manifestKind: "workflow-table",
    gridDefault: { h: 4, w: 12 },
    viewExport: "DataTableSurface",
  });
  expect(getWorkflowBoardHostMapping("form-surface")).toMatchObject({
    boardCategory: "approval",
    boardHosted: true,
    manifestKind: "workflow-approval",
    gridDefault: { h: 3, w: 4 },
    viewExport: "FormSurface",
  });
}

export function assertWorkflowLayoutHintsFromManifestKind(): void {
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
}

export function assertLiftedWorkflowManifestDecision(): void {
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
}
