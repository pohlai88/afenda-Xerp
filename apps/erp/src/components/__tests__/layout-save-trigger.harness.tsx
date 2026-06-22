"use client";

import type { DashboardLayoutPreset } from "@afenda/appshell";

import { PolicyGateSurface } from "@/components/policy-gate-surface.client";
import { usePolicyGateHandler } from "@/lib/api/use-policy-gate-handler.client";
import { useWorkspaceDashboardLayout } from "@/lib/workspace/use-workspace-dashboard-layout.client";
import { useWorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.context";

interface LayoutSaveTriggerProps {
  readonly nextLayout: DashboardLayoutPreset;
}

export function LayoutSaveTrigger({ nextLayout }: LayoutSaveTriggerProps) {
  const workspaceScope = useWorkspaceApiScope();
  const { clearGate, gateState, handleApiError } = usePolicyGateHandler();
  const { saveLayout } = useWorkspaceDashboardLayout({
    clearGate,
    handleApiError,
    workspaceScope,
  });

  return (
    <>
      <button
        onClick={() => {
          void saveLayout(nextLayout);
        }}
        type="button"
      >
        Trigger layout save
      </button>
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
