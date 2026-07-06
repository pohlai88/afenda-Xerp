import type { WorkspaceBoardWidgetCategory } from "../../types/views";
import type { WorkspaceBoardManifestKind } from "./workspace-board-manifest-registry";

/**
 * Lane A-09 Option A HOLD lifted in Lane B-10 after B-09 board proof.
 * Board-hosted workflow surfaces now reference canonical manifest `kind` rows.
 */
export const WORKFLOW_BOARD_MANIFEST_DECISION = {
  lane: "LANE-A-09",
  liftedBy: "LANE-B-10",
  option: "A",
  recordedAt: "2026-07-06",
  status: "LIFTED",
  summary:
    "Dedicated manifest kind rows (`workflow-table`, `workflow-approval`) are canonical after B-09 ERP board proof. Category mapping remains for transitional dual-read.",
} as const;

export type WorkflowBoardHostSurface =
  | "confirm-dialog-surface"
  | "data-table-surface"
  | "form-surface"
  | "page-surface"
  | "settings-surface";

export interface WorkflowBoardHostMapping {
  readonly adrGridReference?: string;
  readonly boardCategory: WorkspaceBoardWidgetCategory | null;
  readonly boardHosted: boolean;
  readonly gridDefault: { readonly h: number; readonly w: number } | null;
  readonly manifestKind: WorkspaceBoardManifestKind | null;
  readonly notes: string;
  readonly surface: WorkflowBoardHostSurface;
  readonly viewExport: string;
}

export const workflowBoardHostMappingRegistry = [
  {
    adrGridReference: "ADR-0041 table default 12x4",
    boardCategory: "table",
    boardHosted: true,
    gridDefault: { h: 4, w: 12 },
    manifestKind: "workflow-table",
    notes:
      "Canonical manifest kind row; ERP bridge resolves ADR-0041 defaults via workflow-table.",
    surface: "data-table-surface",
    viewExport: "DataTableSurface",
  },
  {
    adrGridReference: "ADR-0041 standard card convention",
    boardCategory: "approval",
    boardHosted: true,
    gridDefault: { h: 3, w: 4 },
    manifestKind: "workflow-approval",
    notes:
      "Canonical manifest kind row; ERP bridge resolves card defaults via workflow-approval.",
    surface: "form-surface",
    viewExport: "FormSurface",
  },
  {
    boardCategory: null,
    boardHosted: false,
    gridDefault: null,
    manifestKind: null,
    notes: "Page chrome; not a board tile.",
    surface: "page-surface",
    viewExport: "PageSurface",
  },
  {
    boardCategory: null,
    boardHosted: false,
    gridDefault: null,
    manifestKind: null,
    notes: "Settings remain page-level surfaces.",
    surface: "settings-surface",
    viewExport: "SettingsSurface",
  },
  {
    boardCategory: null,
    boardHosted: false,
    gridDefault: null,
    manifestKind: null,
    notes: "Modal confirmation surface; not a board tile.",
    surface: "confirm-dialog-surface",
    viewExport: "ConfirmDialogSurface",
  },
] as const satisfies readonly WorkflowBoardHostMapping[];

export function listWorkflowBoardHostMappings(): readonly WorkflowBoardHostMapping[] {
  return workflowBoardHostMappingRegistry;
}

export function getWorkflowBoardHostMapping(
  surface: WorkflowBoardHostSurface
): WorkflowBoardHostMapping | undefined {
  return workflowBoardHostMappingRegistry.find(
    (entry) => entry.surface === surface
  );
}

export function listBoardHostedWorkflowSurfaces(): readonly WorkflowBoardHostSurface[] {
  return workflowBoardHostMappingRegistry
    .filter((entry) => entry.boardHosted)
    .map((entry) => entry.surface);
}
