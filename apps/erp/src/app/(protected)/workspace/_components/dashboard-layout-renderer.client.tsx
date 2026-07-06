"use client";

import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

import { WorkspaceBoardCanvasClient } from "@/components/workspace/workspace-board-canvas.client";

export interface DashboardLayoutRendererProps {
  readonly editable?: boolean;
  readonly layout: DashboardLayoutPresetDto;
  readonly onLayoutChange?: (layout: DashboardLayoutPresetDto) => void;
}

/**
 * Workspace dashboard layout host — delegates to ADR-0042 WorkspaceBoardCanvasClient.
 */
export function DashboardLayoutRenderer({
  editable = false,
  layout,
  onLayoutChange,
}: DashboardLayoutRendererProps) {
  return (
    <WorkspaceBoardCanvasClient
      editable={editable}
      layout={layout}
      {...(onLayoutChange === undefined ? {} : { onLayoutChange })}
    />
  );
}
