import type { MutationScope } from "@/lib/outbox/resolve-mutation-scope.server.js";

/**
 * Mandatory ERP operating-spine phases (ADR-0001 TIP-012).
 * Validation and authorization run in `createApiHandler` before `runProtectedMutation`.
 */
export const PROTECTED_MUTATION_SPINE_PHASES = [
  "validation",
  "authorization",
  "policy",
  "execution",
  "audit",
  "observability",
  "event_publication",
] as const;

export type ProtectedMutationSpinePhase =
  (typeof PROTECTED_MUTATION_SPINE_PHASES)[number];

export interface ProtectedMutationSpineResult<TResult> {
  readonly correlationId: string;
  readonly result: TResult;
  readonly scope: MutationScope;
}

export interface ProtectedMutationObservabilityEvent {
  readonly correlationId: string;
  readonly requestId: string;
  readonly scope: MutationScope;
}
