/**
 * PAS-004C §4.8 — B45: KnowledgeTransitionRule registry.
 *
 * Explicit promotion rules for proposed→accepted→ratified→implemented.
 */
import type { KnowledgeTransitionRule } from "../contracts/knowledge-transition.contract.js";

export const KNOWLEDGE_TRANSITION_RULES = [
  {
    from: "proposed",
    to: "accepted",
    requiredAuthority: [
      "internal_committee",
      "standards_body",
      "architecture_committee",
      "corporate_board",
      "regulatory_body",
      "legal_entity",
    ],
    minChainSteps: 2,
    requiredEvidence: true,
    requiredReview: false,
    notes:
      "Acceptance requires a multi-step chain, typed evidence, and a recorded accepting authority.",
  },
  {
    from: "accepted",
    to: "ratified",
    requiredAuthority: ["architecture_committee"],
    minChainSteps: 3,
    requiredEvidence: true,
    requiredReview: true,
    notes:
      "Ratification requires architecture authority confirmation in the acceptance chain.",
  },
  {
    from: "ratified",
    to: "implemented",
    requiredAuthority: [],
    minChainSteps: 3,
    requiredEvidence: true,
    requiredReview: false,
    notes:
      "Implementation requires honest runtime mapping (implementationMapping or realizationMapping).",
  },
] satisfies readonly KnowledgeTransitionRule[];

export type KnowledgeTransitionRuleId =
  `${KnowledgeTransitionRule["from"]}->${KnowledgeTransitionRule["to"]}`;

export function getKnowledgeTransitionRule(
  from: KnowledgeTransitionRule["from"],
  to: KnowledgeTransitionRule["to"]
): KnowledgeTransitionRule | undefined {
  return KNOWLEDGE_TRANSITION_RULES.find(
    (rule) => rule.from === from && rule.to === to
  );
}
