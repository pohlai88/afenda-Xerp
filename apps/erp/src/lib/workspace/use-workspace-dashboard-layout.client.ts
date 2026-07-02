"use client";

import { useEffect, useState } from "react";

import { fetchWorkspaceDashboardLayout } from "@/lib/api/workspace-dashboard.client";
import type { DashboardLayoutResponseDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

import { useWorkspaceApiScope } from "./workspace-api-scope.context";

export type WorkspaceDashboardLayoutStatus =
  | "error"
  | "idle"
  | "loaded"
  | "loading";

export interface WorkspaceDashboardLayoutState {
  readonly errorMessage: string | null;
  readonly layout: DashboardLayoutResponseDto | null;
  readonly status: WorkspaceDashboardLayoutStatus;
}

const INITIAL_STATE: WorkspaceDashboardLayoutState = {
  errorMessage: null,
  layout: null,
  status: "idle",
};

export function useWorkspaceDashboardLayout(): WorkspaceDashboardLayoutState {
  const scope = useWorkspaceApiScope();
  const [state, setState] =
    useState<WorkspaceDashboardLayoutState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    setState({ errorMessage: null, layout: null, status: "loading" });

    fetchWorkspaceDashboardLayout(scope)
      .then((layout) => {
        if (cancelled) {
          return;
        }

        setState({ errorMessage: null, layout, status: "loaded" });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load workspace dashboard layout.";

        setState({ errorMessage: message, layout: null, status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [scope]);

  return state;
}
