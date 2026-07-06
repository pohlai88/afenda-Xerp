"use client";

import { WorkspaceBoardCanvasClient } from "@/components/workspace/workspace-board-canvas.client";
import { WorkspaceDashboardToolbar } from "@/components/workspace/workspace-dashboard-toolbar.client";
import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";
import { useCallback, useState } from "react";

export interface WorkspaceDashboardBoardProps {
  readonly canEditLayout: boolean;
  readonly initialLayout: DashboardLayoutPresetDto;
}

export function WorkspaceDashboardBoard({
  canEditLayout,
  initialLayout,
}: WorkspaceDashboardBoardProps) {
  const [editMode, setEditMode] = useState(false);
  const [layout, setLayout] = useState(initialLayout);

  const handleLayoutChange = useCallback((nextLayout: DashboardLayoutPresetDto) => {
    setLayout(nextLayout);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <WorkspaceDashboardToolbar
        canEditLayout={canEditLayout}
        editMode={editMode}
        onEditModeChange={setEditMode}
      />
      <WorkspaceBoardCanvasClient
        editable={canEditLayout && editMode}
        layout={layout}
        onLayoutChange={handleLayoutChange}
      />
    </div>
  );
}
