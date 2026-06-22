"use client";

import { ApplicationShellDashboardCanvas } from "@afenda/appshell";

import { PolicyGateSurface } from "@/components/policy-gate-surface.client";
import { useProtectedWorkspaceDashboard } from "@/lib/workspace/use-protected-workspace-dashboard.client";

export function ProtectedWorkspaceDashboard() {
  const {
    canEditLayout,
    clearGate,
    errorMessage,
    gateState,
    handleLayoutChange,
    isLoading,
    layout,
    renderContext,
  } = useProtectedWorkspaceDashboard();

  if (isLoading) {
    return (
      <p className="app-shell-page-description" role="status">
        Loading dashboard…
      </p>
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
      {errorMessage !== null ? (
        <p className="app-shell-page-description" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <ApplicationShellDashboardCanvas
        editMode={canEditLayout}
        layout={layout}
        renderContext={renderContext}
        {...(canEditLayout
          ? { onLayoutChange: handleLayoutChange }
          : {})}
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
