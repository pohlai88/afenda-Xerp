"use client";

import { useWorkspaceDashboardLayout } from "./use-workspace-dashboard-layout.client";
import { useWorkspaceDashboardCapabilities } from "./workspace-dashboard-capabilities.context";

export type ProtectedWorkspaceDashboardStatus =
  | "error"
  | "loading"
  | "ready"
  | "unavailable";

export interface ProtectedWorkspaceDashboardState {
  readonly canEditLayout: boolean;
  readonly errorMessage: string | null;
  readonly layout: ReturnType<typeof useWorkspaceDashboardLayout>["layout"];
  readonly status: ProtectedWorkspaceDashboardStatus;
}

export function useProtectedWorkspaceDashboard(): ProtectedWorkspaceDashboardState {
  const layoutState = useWorkspaceDashboardLayout();
  const capabilities = useWorkspaceDashboardCapabilities();

  if (layoutState.status === "idle" || layoutState.status === "loading") {
    return {
      canEditLayout: capabilities.canEditLayout,
      errorMessage: null,
      layout: layoutState.layout,
      status: "loading",
    };
  }

  if (layoutState.status === "error") {
    return {
      canEditLayout: capabilities.canEditLayout,
      errorMessage: layoutState.errorMessage,
      layout: null,
      status: "error",
    };
  }

  return {
    canEditLayout: capabilities.canEditLayout,
    errorMessage: null,
    layout: layoutState.layout,
    status: "ready",
  };
}
