"use client";

import {
  type DashboardLayoutPreset,
  DEFAULT_DASHBOARD_LAYOUT,
  parseDashboardLayoutPreset,
} from "@afenda/appshell";
import { useCallback, useEffect, useRef, useState } from "react";
import { resolveLayoutLoadFallback } from "@/lib/api/api-unauthenticated.error";
import {
  fetchWorkspaceDashboardLayout,
  resetWorkspaceDashboardLayoutApi,
  saveWorkspaceDashboardLayout,
} from "@/lib/api/dashboard-layout.client";
import type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";
import type { WorkspaceDashboardLayoutLoadFallback } from "@/lib/workspace/workspace-dashboard-layout.contract";

export interface UseWorkspaceDashboardLayoutOptions {
  readonly clearGate?: () => void;
  readonly handleApiError?: (
    error: unknown,
    options: { readonly variant: "inline" | "dialog" }
  ) => boolean;
  /** Dev harness: use default layout when GET returns 401 instead of surfacing an error. */
  readonly useDefaultLayoutOnUnauthenticated?: boolean;
  readonly workspaceScope: WorkspaceApiScope;
}

export interface UseWorkspaceDashboardLayoutResult {
  readonly canPersistLayout: boolean;
  readonly errorMessage: string | null;
  readonly isLoading: boolean;
  readonly layout: DashboardLayoutPreset;
  readonly layoutLoadFallback: WorkspaceDashboardLayoutLoadFallback | null;
  readonly resetLayout: () => Promise<void>;
  readonly saveLayout: (nextLayout: DashboardLayoutPreset) => Promise<void>;
  readonly updatedAt: string | null;
}

export function useWorkspaceDashboardLayout({
  workspaceScope,
  clearGate,
  handleApiError,
  useDefaultLayoutOnUnauthenticated = false,
}: UseWorkspaceDashboardLayoutOptions): UseWorkspaceDashboardLayoutResult {
  const [layout, setLayout] = useState<DashboardLayoutPreset>(
    DEFAULT_DASHBOARD_LAYOUT
  );
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canPersistLayout, setCanPersistLayout] = useState(true);
  const [layoutLoadFallback, setLayoutLoadFallback] =
    useState<WorkspaceDashboardLayoutLoadFallback | null>(null);
  const layoutSnapshotRef = useRef(layout);
  const canPersistLayoutRef = useRef(canPersistLayout);
  const clearGateRef = useRef(clearGate);
  const handleApiErrorRef = useRef(handleApiError);
  const useDefaultLayoutOnUnauthenticatedRef = useRef(
    useDefaultLayoutOnUnauthenticated
  );
  const workspaceScopeRef = useRef(workspaceScope);

  useEffect(() => {
    clearGateRef.current = clearGate;
    handleApiErrorRef.current = handleApiError;
    useDefaultLayoutOnUnauthenticatedRef.current =
      useDefaultLayoutOnUnauthenticated;
    workspaceScopeRef.current = workspaceScope;
  });

  useEffect(() => {
    layoutSnapshotRef.current = layout;
  }, [layout]);

  useEffect(() => {
    canPersistLayoutRef.current = canPersistLayout;
  }, [canPersistLayout]);

  const workspaceScopeKey = [
    workspaceScope.tenantSlug,
    workspaceScope.companySlug ?? "",
    workspaceScope.companyId ?? "",
    workspaceScope.organizationSlug ?? "",
    workspaceScope.organizationId ?? "",
    workspaceScope.workspaceId ?? "",
  ].join("|");

  useEffect(() => {
    async function loadLayout() {
      setIsLoading(true);

      try {
        const response = await fetchWorkspaceDashboardLayout(
          workspaceScopeRef.current
        );

        const parsedLayout = parseDashboardLayoutPreset(response.layout);
        setLayout(parsedLayout ?? DEFAULT_DASHBOARD_LAYOUT);
        setUpdatedAt(response.updatedAt);
        setErrorMessage(null);
        setCanPersistLayout(true);
        setLayoutLoadFallback(null);
        clearGateRef.current?.();
      } catch (error: unknown) {
        const loadFallback = resolveLayoutLoadFallback(
          error,
          useDefaultLayoutOnUnauthenticatedRef.current
        );

        if (loadFallback !== null) {
          setLayout(DEFAULT_DASHBOARD_LAYOUT);
          setUpdatedAt(null);
          setErrorMessage(null);
          setCanPersistLayout(false);
          setLayoutLoadFallback(loadFallback);
          return;
        }

        if (handleApiErrorRef.current?.(error, { variant: "inline" })) {
          setLayout(DEFAULT_DASHBOARD_LAYOUT);
          setUpdatedAt(null);
          setErrorMessage(null);
          setCanPersistLayout(false);
          setLayoutLoadFallback(null);
          return;
        }

        setLayout(DEFAULT_DASHBOARD_LAYOUT);
        setUpdatedAt(null);
        setCanPersistLayout(false);
        setLayoutLoadFallback(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard layout."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadLayout();
  }, [workspaceScopeKey]);

  const saveLayout = useCallback(
    async (nextLayout: DashboardLayoutPreset) => {
      if (!canPersistLayoutRef.current) {
        setLayout(nextLayout);
        return;
      }

      const previousLayout = layoutSnapshotRef.current;
      setLayout(nextLayout);

      try {
        const response = await saveWorkspaceDashboardLayout(
          workspaceScope,
          nextLayout
        );
        setUpdatedAt(response.updatedAt);
        setErrorMessage(null);
        clearGate?.();
      } catch (error: unknown) {
        setLayout(previousLayout);

        if (handleApiError?.(error, { variant: "dialog" })) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to save dashboard layout."
        );
      }
    },
    [clearGate, handleApiError, workspaceScope]
  );

  const resetLayout = useCallback(async () => {
    if (!canPersistLayoutRef.current) {
      setLayout(DEFAULT_DASHBOARD_LAYOUT);
      setUpdatedAt(null);
      setErrorMessage(null);
      return;
    }

    try {
      await resetWorkspaceDashboardLayoutApi(workspaceScope);
      setLayout(DEFAULT_DASHBOARD_LAYOUT);
      setUpdatedAt(null);
      setErrorMessage(null);
      clearGate?.();
    } catch (error: unknown) {
      if (handleApiError?.(error, { variant: "dialog" })) {
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to reset dashboard layout."
      );
    }
  }, [clearGate, handleApiError, workspaceScope]);

  return {
    canPersistLayout,
    errorMessage,
    isLoading,
    layout,
    layoutLoadFallback,
    resetLayout,
    saveLayout,
    updatedAt,
  };
}
