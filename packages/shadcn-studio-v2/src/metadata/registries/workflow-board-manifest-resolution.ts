import type {
  WorkspaceBoardWidgetCategory,
  WorkspaceBoardWidgetSize,
} from "../../types/views";
import {
  getWorkspaceBoardManifestByKind,
  type WorkspaceBoardManifestKind,
} from "./workspace-board-manifest-registry";
import {
  getWorkflowBoardHostMapping,
  type WorkflowBoardHostSurface,
} from "./workflow-board-host-mapping";

export type WorkflowBoardLayoutHintSource = "category-shim" | "manifest-kind";

export interface WorkflowBoardLayoutHint {
  readonly category: WorkspaceBoardWidgetCategory;
  readonly defaultSize: WorkspaceBoardWidgetSize;
  readonly kind: string;
  readonly manifestKind: WorkspaceBoardManifestKind | null;
  readonly minSize: WorkspaceBoardWidgetSize;
  readonly source: WorkflowBoardLayoutHintSource;
}

/**
 * Dual-read resolver: canonical manifest `kind` rows first, category shim fallback.
 * Transitional bridge for ERP consumers migrating off A-09 Option A HOLD.
 */
export function resolveWorkflowBoardLayoutHint(
  surface: WorkflowBoardHostSurface
): WorkflowBoardLayoutHint | undefined {
  const mapping = getWorkflowBoardHostMapping(surface);

  if (mapping?.boardHosted !== true || mapping.gridDefault === null) {
    return undefined;
  }

  if (mapping.manifestKind !== null) {
    const manifest = getWorkspaceBoardManifestByKind(mapping.manifestKind);

    if (manifest !== undefined) {
      return {
        category: manifest.category,
        defaultSize: manifest.defaultSize,
        kind: manifest.kind,
        manifestKind: mapping.manifestKind,
        minSize: manifest.minSize,
        source: "manifest-kind",
      };
    }
  }

  if (mapping.boardCategory !== null) {
    return {
      category: mapping.boardCategory,
      defaultSize: mapping.gridDefault,
      kind: mapping.boardCategory,
      manifestKind: null,
      minSize: mapping.gridDefault,
      source: "category-shim",
    };
  }

  return undefined;
}
