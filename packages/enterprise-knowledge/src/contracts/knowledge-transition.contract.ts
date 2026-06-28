/**
 * PAS-004C §4.8 — B45: Lifecycle transition governance contract.
 *
 * Governs explicit promotion rules between lifecycle states — policy-only;
 * does not auto-mutate atoms.json.
 */
import type { AcceptingAuthorityClassification } from "./accepting-authority.contract.js";
import type { KnowledgeLifecycleStatus } from "./knowledge-atom.contract.js";

export interface KnowledgeTransitionRule {
  readonly from: KnowledgeLifecycleStatus;
  readonly minChainSteps: number;
  readonly notes: string;
  readonly requiredAuthority: readonly AcceptingAuthorityClassification[];
  readonly requiredEvidence: boolean;
  readonly requiredReview: boolean;
  readonly to: KnowledgeLifecycleStatus;
}

export interface LifecycleTransitionResult {
  readonly allowed: boolean;
  readonly reasons: readonly string[];
}
