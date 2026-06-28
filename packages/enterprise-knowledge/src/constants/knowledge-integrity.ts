import type { KnowledgeIntegrityProfile } from "../contracts/knowledge-atom.contract.js";

/** MVP registry rows must declare every integrity dimension present. */
export const COMPLETE_INTEGRITY_PROFILE = {
  correctness: true,
  completeness: true,
  consistency: true,
  authority: true,
  acceptance: true,
  evidence: true,
  reasoning: true,
  applicability: true,
  evolution: true,
  relationship: true,
} as const satisfies KnowledgeIntegrityProfile;
