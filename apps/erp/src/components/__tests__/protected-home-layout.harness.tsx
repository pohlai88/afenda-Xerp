"use client";

import {
  ApplicationShellDashboardCanvas,
  type DashboardLayoutPreset,
} from "@afenda/appshell";

import { PolicyGateSurface } from "@/components/policy-gate-surface.client";
import { useProtectedWorkspaceDashboard } from "@/lib/workspace/use-protected-workspace-dashboard.client";

interface ProtectedHomeLayoutHarnessProps {
  readonly nextLayoutForSave?: DashboardLayoutPreset;
}

/** Integration harness — single hook instance for protected home dashboard + save trigger. */
export function ProtectedHomeLayoutHarness({
  nextLayoutForSave,
}: ProtectedHomeLayoutHarnessProps) {
  const {
    canEditLayout,
    clearGate,
    errorMessage,
    gateState,
    handleLayoutChange,
    isLoading,
    layout,
    renderContext,
    saveLayout,
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
      {errorMessage === null ? null : (
        <p className="app-shell-page-description" role="alert">
          {errorMessage}
        </p>
      )}
      <ApplicationShellDashboardCanvas
        editMode={canEditLayout}
        layout={layout}
        renderContext={renderContext}
        {...(canEditLayout ? { onLayoutChange: handleLayoutChange } : {})}
      />
      {nextLayoutForSave === undefined ? null : (
        <button
          onClick={() => {
            void saveLayout(nextLayoutForSave);
          }}
          type="button"
        >
          Trigger protected layout save
        </button>
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
    </>
  );
}
