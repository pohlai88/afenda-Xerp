"use client";

import {
  ApplicationShellDashboardCanvas,
  type DashboardLayoutPreset,
} from "@afenda/appshell";
import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useMemo } from "react";

import {
  DashboardWidgetRbacPreviewControls,
  useDashboardWidgetRenderContextPreview,
} from "@/components/dashboard-widget-rbac-preview-controls.client";
import { PolicyGateSurface } from "@/components/policy-gate-surface.client";
import { usePolicyGateHandler } from "@/lib/api/use-policy-gate-handler.client";
import { DEV_WORKSPACE_API_SCOPE } from "@/lib/workspace/dev-workspace-scope";
import { useWorkspaceDashboardLayout } from "@/lib/workspace/use-workspace-dashboard-layout.client";
import { useOptionalWorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.context";

export type AppShellCanvasHarnessGovernedComponents = Extract<
  GovernedUiComponentName,
  "Alert" | "AlertDialog" | "Button"
>;

export interface AppShellCanvasHarnessProps {
  readonly showRbacPreviewControls?: boolean;
}

export function AppShellCanvasHarness({
  showRbacPreviewControls = false,
}: AppShellCanvasHarnessProps) {
  const contextScope = useOptionalWorkspaceApiScope();
  const workspaceScope = contextScope ?? DEV_WORKSPACE_API_SCOPE;
  const { clearGate, gateState, handleApiError } = usePolicyGateHandler();
  const {
    canPersistLayout,
    errorMessage,
    isLoading,
    layout,
    layoutLoadFallback,
    resetLayout,
    saveLayout,
    updatedAt,
  } = useWorkspaceDashboardLayout({
    clearGate,
    handleApiError,
    useDefaultLayoutOnUnauthenticated: true,
    workspaceScope,
  });

  const statusCopy = useMemo(() => {
    if (isLoading) {
      return "Loading layout…";
    }

    if (layoutLoadFallback === "unauthenticated") {
      return "Using default layout (sign in to load or save workspace layout).";
    }

    if (updatedAt === null) {
      return "Using default layout.";
    }

    return `Saved at ${updatedAt}`;
  }, [isLoading, layoutLoadFallback, updatedAt]);

  const { previewMode, renderContext, setPreviewMode } =
    useDashboardWidgetRenderContextPreview(showRbacPreviewControls);

  const handleLayoutChange = (nextLayout: DashboardLayoutPreset) => {
    void saveLayout(nextLayout);
  };

  return (
    <div className="app-shell-page">
      <header className="app-shell-page-header">
        <div className="app-shell-page-title-row">
          <h1 className="app-shell-page-title">Dashboard canvas</h1>
          <div className="app-shell-page-actions">
            {showRbacPreviewControls ? (
              <DashboardWidgetRbacPreviewControls
                onPreviewModeChange={setPreviewMode}
                previewMode={previewMode}
              />
            ) : null}
            <Button
              disabled={!canPersistLayout}
              emphasis="outline"
              intent="secondary"
              onClick={() => {
                void resetLayout();
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
        {gateState?.variant === "inline" ? (
          <PolicyGateSurface
            correlationId={gateState.correlationId}
            gateDecision={gateState.gateDecision}
            message={gateState.message}
            onDismiss={clearGate}
            onPrimaryAction={clearGate}
            variant="inline"
          />
        ) : null}
        {errorMessage === null ? null : (
          <p className="app-shell-page-description" role="alert">
            {errorMessage}
          </p>
        )}
      </header>
      {isLoading ? null : (
        <ApplicationShellDashboardCanvas
          editMode
          layout={layout}
          onLayoutChange={handleLayoutChange}
          renderContext={renderContext}
        />
      )}
      {gateState?.variant === "dialog" ? (
        <PolicyGateSurface
          correlationId={gateState.correlationId}
          gateDecision={gateState.gateDecision}
          message={gateState.message}
          onDismiss={clearGate}
          onOpenChange={(open) => {
            if (!open) {
              clearGate();
            }
          }}
          onPrimaryAction={clearGate}
          open
          variant="dialog"
        />
      ) : null}
    </div>
  );
}
