"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ApplicationShellDashboardCanvas,
  DEFAULT_DASHBOARD_LAYOUT,
  parseDashboardLayoutPreset,
  type DashboardLayoutPreset,
} from "@afenda/appshell";
import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  fetchWorkspaceDashboardLayout,
  resetWorkspaceDashboardLayoutApi,
  saveWorkspaceDashboardLayout,
} from "@/lib/api/dashboard-layout.client";

export type AppShellCanvasHarnessGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

export function AppShellCanvasHarness() {
  const [layout, setLayout] = useState<DashboardLayoutPreset>(
    DEFAULT_DASHBOARD_LAYOUT
  );
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLayout() {
      try {
        const response = await fetchWorkspaceDashboardLayout();
        if (cancelled) {
          return;
        }

        const parsedLayout = parseDashboardLayoutPreset(response.layout);
        setLayout(parsedLayout ?? DEFAULT_DASHBOARD_LAYOUT);
        setUpdatedAt(response.updatedAt);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        setLayout(DEFAULT_DASHBOARD_LAYOUT);
        setUpdatedAt(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard layout."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadLayout();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLayoutChange = useCallback(
    async (nextLayout: DashboardLayoutPreset) => {
      setLayout(nextLayout);

      try {
        const response = await saveWorkspaceDashboardLayout(nextLayout);
        setUpdatedAt(response.updatedAt);
        setErrorMessage(null);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to save dashboard layout."
        );
      }
    },
    []
  );

  const handleResetLayout = useCallback(async () => {
    try {
      await resetWorkspaceDashboardLayoutApi();
      setLayout(DEFAULT_DASHBOARD_LAYOUT);
      setUpdatedAt(null);
      setErrorMessage(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to reset dashboard layout."
      );
    }
  }, []);

  const statusCopy = useMemo(() => {
    if (isLoading) {
      return "Loading layout…";
    }

    if (updatedAt === null) {
      return "Using default layout.";
    }

    return `Saved at ${updatedAt}`;
  }, [isLoading, updatedAt]);

  return (
    <div className="app-shell-page">
      <header className="app-shell-page-header">
        <div className="app-shell-page-title-row">
          <h1 className="app-shell-page-title">Dashboard canvas</h1>
          <div className="app-shell-page-actions">
            <Button
              emphasis="outline"
              intent="secondary"
              onClick={() => {
                void handleResetLayout();
              }}
              size="sm"
            >
              Reset layout
            </Button>
          </div>
        </div>
        <p className="app-shell-page-description">
          Editable grid demo persisted through the governed workspace dashboard
          layout API.
        </p>
        <p className="app-shell-page-description">{statusCopy}</p>
        {errorMessage !== null ? (
          <p className="app-shell-page-description">{errorMessage}</p>
        ) : null}
      </header>
      {!isLoading ? (
        <ApplicationShellDashboardCanvas
          editMode
          layout={layout}
          onLayoutChange={(nextLayout) => {
            void handleLayoutChange(nextLayout);
          }}
        />
      ) : null}
    </div>
  );
}
