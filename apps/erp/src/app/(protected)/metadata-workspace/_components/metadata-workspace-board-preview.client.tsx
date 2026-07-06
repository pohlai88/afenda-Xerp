"use client";

import { getWorkflowBoardHostMapping } from "@afenda/shadcn-studio-v2/metadata";
import { useMemo, useState } from "react";

import { WorkspaceBoardCanvasClient } from "@/components/workspace/workspace-board-canvas.client";
import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

const TABLE_HOST_MAPPING = getWorkflowBoardHostMapping("data-table-surface");

export function MetadataWorkspaceBoardPreview() {
  const [editMode, setEditMode] = useState(true);

  const layout = useMemo((): DashboardLayoutPresetDto => {
    const tableDefault = TABLE_HOST_MAPPING?.gridDefault ?? { w: 12, h: 4 };

    return {
      columns: 12,
      items: [
        {
          h: tableDefault.h,
          i: "invoice-table",
          w: tableDefault.w,
          x: 0,
          y: 0,
        },
      ],
      rowHeight: 80,
      version: 1,
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-sm">
          Workflow board runtime preview (ADR-0042)
        </p>
        <button
          className="rounded-md border px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => {
            setEditMode((current) => !current);
          }}
          type="button"
        >
          {editMode ? "Exit edit mode" : "Enter edit mode"}
        </button>
      </div>
      <WorkspaceBoardCanvasClient editable={editMode} layout={layout} />
    </div>
  );
}
