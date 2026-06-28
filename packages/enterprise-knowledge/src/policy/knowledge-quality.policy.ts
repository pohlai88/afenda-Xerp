import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import { KNOWLEDGE_INTEGRITY_DIMENSIONS } from "../contracts/knowledge-atom.contract.js";

/**
 * PAS-004A B29 — derive integrity quality score from atom integrity profile.
 * MVP: presence-only dimensions (all true in seed corpus) → 100 when complete.
 */
export function deriveKnowledgeIntegrityScore(atom: KnowledgeAtom): number {
  let trueCount = 0;
  for (const dimension of KNOWLEDGE_INTEGRITY_DIMENSIONS) {
    if (atom.integrity[dimension] === true) {
      trueCount += 1;
    }
  }

  return Math.round((trueCount / KNOWLEDGE_INTEGRITY_DIMENSIONS.length) * 100);
}

export function deriveKnowledgeQualityScore(atom: KnowledgeAtom): number {
  const integrityScore = deriveKnowledgeIntegrityScore(atom);
  const evidenceScore = atom.typedEvidence.length > 0 ? 100 : 0;
  const reasoningScore =
    atom.structuredReasoning.premises.length > 0 &&
    atom.structuredReasoning.conclusion.length > 0
      ? 100
      : 0;

  return Math.round((integrityScore + evidenceScore + reasoningScore) / 3);
}

export function isFullyIntegrityVerifiedAtom(atom: KnowledgeAtom): boolean {
  return deriveKnowledgeIntegrityScore(atom) === 100;
}

export function isProductionCandidateQualityAtom(atom: KnowledgeAtom): boolean {
  return deriveKnowledgeQualityScore(atom) >= 90;
}
