"use client";

import { ApplicationShellDashboardCanvas } from "@afenda/appshell";
import { Alert, AlertDescription, AlertTitle, Skeleton } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useMemo } from "react";

import { PolicyGateSurface } from "@/components/policy-gate-surface.client";
import {
  resolveWorkspaceDashboardLoadedStatusCopy,
  resolveWorkspaceDashboardStatusCopy,
} from "@/lib/workspace/resolve-workspace-dashboard-status-copy";
import { useProtectedWorkspaceDashboard } from "@/lib/workspace/use-protected-workspace-dashboard.client";
import { WORKSPACE_HOME_COPY } from "@/lib/workspace/workspace-home.copy.contract";

export type ProtectedWorkspaceDashboardGovernedComponents = Extract<
  GovernedUiComponentName,
  "Alert" | "Skeleton"
>;

export function ProtectedWorkspaceDashboard() {
  const {
    canEditLayout,
    clearGate,
    errorMessage,
    gateState,
    handleLayoutChange,
    isLoading,
    layout,
    layoutLoadFallback,
    renderContext,
    updatedAt,
  } = useProtectedWorkspaceDashboard();

  const statusCopy = useMemo(() => {
    if (isLoading) {
      return resolveWorkspaceDashboardStatusCopy({ kind: "loading" });
    }

    return resolveWorkspaceDashboardLoadedStatusCopy({
      layoutLoadFallback,
      updatedAt,
    });
  }, [isLoading, layoutLoadFallback, updatedAt]);

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className="flex flex-col gap-4"
        role="status"
      >
        {statusCopy.screenReader === undefined ? null : (
          <span className="sr-only">{statusCopy.screenReader}</span>
        )}
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return (
    <>
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
      <p className="app-shell-page-description">{statusCopy.statusLine}</p>
      {errorMessage === null ? null : (
        <Alert role="alert" tone="danger">
          <AlertTitle>
            {WORKSPACE_HOME_COPY.dashboard.errorAlertTitle}
          </AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <ApplicationShellDashboardCanvas
        editMode={canEditLayout}
        layout={layout}
        renderContext={renderContext}
        {...(canEditLayout ? { onLayoutChange: handleLayoutChange } : {})}
      />
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
    </>
  );
}
