"use client";

import {
  type DashboardLayoutPreset,
  useDashboardWidgetRenderContext,
} from "@afenda/appshell";

import { usePolicyGateHandler } from "@/lib/api/use-policy-gate-handler.client";
import { useWorkspaceDashboardLayout } from "@/lib/workspace/use-workspace-dashboard-layout.client";
import { useWorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.context";
import { useWorkspaceDashboardCapabilities } from "@/lib/workspace/workspace-dashboard-capabilities.context";

export function useProtectedWorkspaceDashboard() {
  const workspaceScope = useWorkspaceApiScope();
  const renderContext = useDashboardWidgetRenderContext();
  const { canEditLayout } = useWorkspaceDashboardCapabilities();
  const { clearGate, gateState, handleApiError } = usePolicyGateHandler();
  const {
    errorMessage,
    isLoading,
    layout,
    layoutLoadFallback,
    saveLayout,
    updatedAt,
  } = useWorkspaceDashboardLayout({
    clearGate,
    handleApiError,
    workspaceScope,
  });

  const handleLayoutChange = (nextLayout: DashboardLayoutPreset) => {
    if (!canEditLayout) {
      return;
    }

    void saveLayout(nextLayout);
  };

  return {
    canEditLayout,
    clearGate,
    errorMessage,
    gateState,
    handleLayoutChange,
    isLoading,
    layout,
    layoutLoadFallback,
    renderContext,
    saveLayout,
    updatedAt,
  };
}
