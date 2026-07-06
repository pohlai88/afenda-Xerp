import {
  getWorkflowBoardHostMapping,
  getWorkspaceBoardManifestByKind,
  resolveWorkflowBoardLayoutHint,
  WORKFLOW_BOARD_MANIFEST_DECISION,
} from "@afenda/shadcn-studio-v2/metadata";

import type { DashboardWidgetDefaultLayoutHint } from "./dashboard-widget-bridge.registry";

/** Transitional dual-read: manifest kind first, host-mapping category shim fallback. */
export function resolveWorkflowTableLayoutHint(): DashboardWidgetDefaultLayoutHint {
  const hint = resolveWorkflowBoardLayoutHint("data-table-surface");

  if (hint?.source === "manifest-kind") {
    return {
      h: hint.defaultSize.h,
      minH: hint.minSize.h,
      minW: hint.minSize.w,
      w: hint.defaultSize.w,
    };
  }

  const mapping = getWorkflowBoardHostMapping("data-table-surface");
  const gridDefault = mapping?.gridDefault ?? { h: 4, w: 12 };

  return {
    h: gridDefault.h,
    minH: 2,
    minW: 6,
    w: gridDefault.w,
  };
}

export function resolveWorkflowApprovalLayoutHint(): DashboardWidgetDefaultLayoutHint {
  const hint = resolveWorkflowBoardLayoutHint("form-surface");

  if (hint?.source === "manifest-kind") {
    return {
      h: hint.defaultSize.h,
      minH: hint.minSize.h,
      minW: hint.minSize.w,
      w: hint.defaultSize.w,
    };
  }

  const mapping = getWorkflowBoardHostMapping("form-surface");
  const gridDefault = mapping?.gridDefault ?? { h: 3, w: 4 };

  return {
    h: gridDefault.h,
    minH: 2,
    minW: 3,
    w: gridDefault.w,
  };
}

export function assertWorkflowManifestKindsAreCanonical(): readonly string[] {
  const gaps: string[] = [];

  if (WORKFLOW_BOARD_MANIFEST_DECISION.status !== "LIFTED") {
    gaps.push("WORKFLOW_BOARD_MANIFEST_DECISION.status must be LIFTED");
  }

  for (const kind of ["workflow-table", "workflow-approval"] as const) {
    const manifest = getWorkspaceBoardManifestByKind(kind);
    const mappingKind = getWorkflowBoardHostMapping(
      kind === "workflow-table" ? "data-table-surface" : "form-surface"
    )?.manifestKind;

    if (manifest === undefined) {
      gaps.push(`missing manifest row for ${kind}`);
    }

    if (mappingKind !== kind) {
      gaps.push(`host mapping manifestKind mismatch for ${kind}`);
    }
  }

  return gaps;
}
