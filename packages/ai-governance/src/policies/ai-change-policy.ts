import type { AiGovernanceGate, AiInvariantId } from "../contracts/ai-change.contract.js";

export interface InvariantPolicy {
  readonly invariant: AiInvariantId;
  readonly gate: AiGovernanceGate;
  readonly baseline: boolean;
  readonly scope: boolean;
}

export const AI_INVARIANT_POLICIES: readonly InvariantPolicy[] = [
  { invariant: "AI-001", gate: "registry", baseline: true, scope: true },
  { invariant: "AI-002", gate: "dependencies", baseline: true, scope: true },
  { invariant: "AI-003", gate: "boundaries", baseline: true, scope: true },
  { invariant: "AI-004", gate: "scope", baseline: false, scope: true },
  { invariant: "AI-004-SCOPE", gate: "scope-drift", baseline: false, scope: true },
  { invariant: "AI-005", gate: "boundaries", baseline: false, scope: true },
  { invariant: "AI-006", gate: "boundaries", baseline: true, scope: true },
  { invariant: "AI-007", gate: "change", baseline: false, scope: true },
  { invariant: "AI-008", gate: "change", baseline: false, scope: true },
  { invariant: "AI-009", gate: "change", baseline: false, scope: true },
  { invariant: "AI-010", gate: "drift", baseline: false, scope: true },
];
