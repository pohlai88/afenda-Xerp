"use client";

import { useState } from "react";

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { PolicyGateSurface } from "@/components/policy-gate-surface.client";
import type { ApiPolicyGateDecision } from "@/lib/api/api-envelope.client";

const POLICY_GATE_DECISIONS: readonly ApiPolicyGateDecision[] = [
  "require_approval",
  "require_evidence",
  "require_step_up",
  "readonly",
];

export type PolicyGateDemoHarnessGovernedComponents = Extract<
  GovernedUiComponentName,
  "Alert" | "AlertDialog" | "Button"
>;

export function PolicyGateDemoHarness() {
  const [dialogDecision, setDialogDecision] =
    useState<ApiPolicyGateDecision | null>(null);

  return (
    <div className="app-shell-page">
      <header className="app-shell-page-header">
        <h1 className="app-shell-page-title">Policy gate surfaces</h1>
        <p className="app-shell-page-description">
          Inline and dialog UX for governed API policy gate decisions. Primary
          actions are placeholders until TIP-010 approval flows land.
        </p>
      </header>

      <div className="erp-policy-gate-demo">
        {POLICY_GATE_DECISIONS.map((gateDecision) => (
          <section className="erp-policy-gate-demo__section" key={gateDecision}>
            <PolicyGateSurface
              correlationId="demo-corr-policy-gate"
              gateDecision={gateDecision}
              onPrimaryAction={() => {
                setDialogDecision(gateDecision);
              }}
              variant="inline"
            />
            <Button
              emphasis="outline"
              intent="secondary"
              onClick={() => {
                setDialogDecision(gateDecision);
              }}
              size="sm"
            >
              Open dialog — {gateDecision}
            </Button>
          </section>
        ))}
      </div>

      {dialogDecision !== null ? (
        <PolicyGateSurface
          correlationId="demo-corr-policy-gate"
          gateDecision={dialogDecision}
          onDismiss={() => {
            setDialogDecision(null);
          }}
          onOpenChange={(open) => {
            if (!open) {
              setDialogDecision(null);
            }
          }}
          onPrimaryAction={() => {
            setDialogDecision(null);
          }}
          open
          variant="dialog"
        />
      ) : null}
    </div>
  );
}
