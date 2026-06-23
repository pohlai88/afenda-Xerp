import type { ApiPolicyGateDecision } from "./api-envelope.client";

export type PolicyGateSurfaceVariant = "inline" | "dialog";

export interface PolicyGateUxCopy {
  readonly description: string;
  readonly primaryActionLabel: string | null;
  readonly title: string;
  readonly tone: "neutral" | "warning";
}

export const POLICY_GATE_UX_COPY: Readonly<
  Record<ApiPolicyGateDecision, PolicyGateUxCopy>
> = {
  require_approval: {
    title: "Approval required",
    description:
      "This action is blocked until an approver authorizes it. Request approval to continue.",
    primaryActionLabel: "Request approval",
    tone: "warning",
  },
  require_evidence: {
    title: "Evidence required",
    description: "Attach supporting evidence before this action can proceed.",
    primaryActionLabel: "Attach evidence",
    tone: "warning",
  },
  require_step_up: {
    title: "Verification required",
    description: "Complete step-up verification to continue with this action.",
    primaryActionLabel: "Verify identity",
    tone: "warning",
  },
  readonly: {
    title: "Read-only access",
    description:
      "Your current role can view this resource but cannot modify it in this workspace scope.",
    primaryActionLabel: null,
    tone: "neutral",
  },
};

export function resolvePolicyGateUxCopy(
  gateDecision: ApiPolicyGateDecision
): PolicyGateUxCopy {
  return POLICY_GATE_UX_COPY[gateDecision];
}
