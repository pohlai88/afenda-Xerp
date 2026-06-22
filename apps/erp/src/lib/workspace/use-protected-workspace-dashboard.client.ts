"use client";

import {
  useDashboardWidgetRenderContext,
  type DashboardLayoutPreset,
} from "@afenda/appshell";

import { usePolicyGateHandler } from "@/lib/api/use-policy-gate-handler.client";
import { useWorkspaceDashboardCapabilities } from "@/lib/workspace/workspace-dashboard-capabilities.context";
import { useWorkspaceDashboardLayout } from "@/lib/workspace/use-workspace-dashboard-layout.client";
import { useWorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.context";

export function useProtectedWorkspaceDashboard() {
  const workspaceScope = useWorkspaceApiScope();
  const renderContext = useDashboardWidgetRenderContext();
  const { canEditLayout } = useWorkspaceDashboardCapabilities();
  const { clearGate, gateState, handleApiError } = usePolicyGateHandler();
  const {
    errorMessage,
    isLoading,
    layout,
    saveLayout,
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
    renderContext,
    saveLayout,
  };
}
