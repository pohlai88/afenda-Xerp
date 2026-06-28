/**
 * PAS-004C §4.8 — B45: Lifecycle transition governance policy.
 */
import type { AcceptingAuthorityClassification } from "../contracts/accepting-authority.contract.js";
import type {
  KnowledgeAtom,
  KnowledgeLifecycleStatus,
} from "../contracts/knowledge-atom.contract.js";
import type {
  KnowledgeTransitionRule,
  LifecycleTransitionResult,
} from "../contracts/knowledge-transition.contract.js";
import { resolveAcceptingAuthorityRef } from "../data/accepting-authority.registry.js";
import {
  getKnowledgeTransitionRule,
  KNOWLEDGE_TRANSITION_RULES,
} from "../data/transition-rules.registry.js";
import { isRatifiedOrLaterLifecycle } from "./knowledge.policy.js";
import { getAtomRealizationMappings } from "./knowledge-realization.policy.js";

const ARCHITECTURE_AUTHORITY_REFS = new Set([
  "architecture_authority",
  "afenda_architecture_authority",
]);

const LIFECYCLE_RANK: Readonly<Record<KnowledgeLifecycleStatus, number>> = {
  observed: 0,
  proposed: 1,
  under_review: 2,
  accepted: 3,
  ratified: 4,
  implemented: 5,
  superseded: 6,
  historical: 7,
};

const PROPOSED_TO_ACCEPTED_RULE = KNOWLEDGE_TRANSITION_RULES[0];
const ACCEPTED_TO_RATIFIED_RULE = KNOWLEDGE_TRANSITION_RULES[1];

if (!(PROPOSED_TO_ACCEPTED_RULE && ACCEPTED_TO_RATIFIED_RULE)) {
  throw new Error("KNOWLEDGE_TRANSITION_RULES registry is incomplete");
}

const COMPLIANCE_RULES_BY_LIFECYCLE: Readonly<
  Partial<Record<KnowledgeLifecycleStatus, readonly KnowledgeTransitionRule[]>>
> = {
  accepted: [PROPOSED_TO_ACCEPTED_RULE],
  ratified: [PROPOSED_TO_ACCEPTED_RULE, ACCEPTED_TO_RATIFIED_RULE],
  implemented: KNOWLEDGE_TRANSITION_RULES,
};

function resolveChainClassification(
  authorityRef: string
): AcceptingAuthorityClassification | undefined {
  const resolved = resolveAcceptingAuthorityRef(authorityRef);
  return resolved?.classification;
}

export function hasArchitectureAuthorityInChain(atom: KnowledgeAtom): boolean {
  return atom.acceptanceChain.some((entry) => {
    if (ARCHITECTURE_AUTHORITY_REFS.has(entry.by)) {
      return true;
    }
    const resolved = resolveAcceptingAuthorityRef(entry.by);
    return resolved?.classification === "architecture_committee";
  });
}

function chainHasRequiredAuthority(
  atom: KnowledgeAtom,
  requiredAuthority: readonly AcceptingAuthorityClassification[]
): boolean {
  if (requiredAuthority.length === 0) {
    return true;
  }

  const present = new Set<AcceptingAuthorityClassification>();
  for (const entry of atom.acceptanceChain) {
    const classification = resolveChainClassification(entry.by);
    if (classification) {
      present.add(classification);
    }
  }

  return requiredAuthority.some((required) => present.has(required));
}

function chainHasReviewStep(atom: KnowledgeAtom): boolean {
  return atom.acceptanceChain.some(
    (entry) => entry.step === "under_review" || entry.step === "ratified"
  );
}

function hasRuntimeImplementationEvidence(atom: KnowledgeAtom): boolean {
  const implementationStatus = atom.implementationMapping?.runtimeStatus;
  if (
    implementationStatus === "implemented" ||
    implementationStatus === "partial"
  ) {
    return true;
  }

  return getAtomRealizationMappings(atom).length > 0;
}

function evaluateTransitionRule(
  atom: KnowledgeAtom,
  rule: KnowledgeTransitionRule,
  prefix: string
): string[] {
  const errors: string[] = [];

  if (atom.acceptanceChain.length < rule.minChainSteps) {
    errors.push(
      `${prefix}: requires at least ${rule.minChainSteps} acceptance chain steps, found ${atom.acceptanceChain.length}`
    );
  }

  if (rule.requiredEvidence && atom.typedEvidence.length === 0) {
    errors.push(`${prefix}: typedEvidence must not be empty`);
  }

  if (!chainHasRequiredAuthority(atom, rule.requiredAuthority)) {
    errors.push(
      `${prefix}: acceptance chain must include authority with classification ${rule.requiredAuthority.join(" or ")}`
    );
  }

  if (rule.requiredReview && !chainHasReviewStep(atom)) {
    errors.push(
      `${prefix}: acceptance chain must include under_review or ratified step`
    );
  }

  if (rule.to === "ratified" && !hasArchitectureAuthorityInChain(atom)) {
    errors.push(
      `${prefix}: ratification requires architecture_authority in acceptance chain`
    );
  }

  if (rule.to === "implemented" && !hasRuntimeImplementationEvidence(atom)) {
    errors.push(
      `${prefix}: implementation requires implementationMapping.runtimeStatus or realizationMapping`
    );
  }

  return errors;
}

/**
 * PAS-004C §4.8 — evaluate whether an atom may transition to `toStatus`.
 */
export function canTransitionLifecycle(
  atom: KnowledgeAtom,
  toStatus: KnowledgeLifecycleStatus
): LifecycleTransitionResult {
  const fromStatus = atom.lifecycle;

  if (fromStatus === toStatus) {
    return { allowed: true, reasons: [] };
  }

  const fromRank = LIFECYCLE_RANK[fromStatus];
  const toRank = LIFECYCLE_RANK[toStatus];

  if (toRank <= fromRank) {
    return {
      allowed: false,
      reasons: [`Cannot transition backward from ${fromStatus} to ${toStatus}`],
    };
  }

  const rule = getKnowledgeTransitionRule(fromStatus, toStatus);
  if (!rule) {
    return {
      allowed: false,
      reasons: [`No transition rule defined from ${fromStatus} to ${toStatus}`],
    };
  }

  const reasons = evaluateTransitionRule(
    atom,
    rule,
    `${fromStatus}->${toStatus}`
  );
  return {
    allowed: reasons.length === 0,
    reasons,
  };
}

/** Validates that an atom at its current lifecycle satisfies retrospective transition rules. */
export function validateAtomLifecycleCompliance(
  atom: KnowledgeAtom
): readonly string[] {
  const errors: string[] = [];
  const rules = COMPLIANCE_RULES_BY_LIFECYCLE[atom.lifecycle];

  if (!rules) {
    return errors;
  }

  for (const rule of rules) {
    errors.push(
      ...evaluateTransitionRule(atom, rule, `${atom.atomId}@${atom.lifecycle}`)
    );
  }

  if (
    isRatifiedOrLaterLifecycle(atom.lifecycle) &&
    !hasArchitectureAuthorityInChain(atom)
  ) {
    errors.push(
      `${atom.atomId}: ratified+ lifecycle requires architecture_authority in acceptance chain`
    );
  }

  return errors;
}

/** Validates lifecycle transition compliance across the full atom corpus. */
export function validateKnowledgeLifecycleTransitions(
  atoms: readonly KnowledgeAtom[]
): readonly string[] {
  const errors: string[] = [];

  if (KNOWLEDGE_TRANSITION_RULES.length < 3) {
    errors.push("expected at least 3 lifecycle transition rules in registry");
  }

  for (const atom of atoms) {
    errors.push(...validateAtomLifecycleCompliance(atom));
  }

  return errors;
}
