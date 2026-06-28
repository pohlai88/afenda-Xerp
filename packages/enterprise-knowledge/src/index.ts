/** PAS-004 / PAS-004A — @afenda/enterprise-knowledge public surface. */

export const ENTERPRISE_KNOWLEDGE_PACKAGE_VERSION = "0.0.0" as const;

// ── Constants ────────────────────────────────────────────────────────────────
export { COMPLETE_INTEGRITY_PROFILE } from "./constants/knowledge-integrity.js";
// ── Accepting Authority (B25 — typed registry entity) ───────────────────────
export {
  ACCEPTING_AUTHORITY_CLASSIFICATIONS,
  ACCEPTING_AUTHORITY_SCOPES,
  type AcceptingAuthorityClassification,
  type AcceptingAuthorityEntity,
  type AcceptingAuthorityScope,
} from "./contracts/accepting-authority.contract.js";
// ── Atom contract (B24 + B25 effective time additions) ──────────────────────
export {
  ACCEPTANCE_CHAIN_STEPS,
  ACCEPTING_AUTHORITIES,
  type AcceptanceChainEntry,
  type AcceptanceChainStep,
  type AcceptingAuthority,
  AUTHORITY_TYPES,
  type AuthorityType,
  BINDING_LEVELS,
  type BindingLevel,
  CONFIDENCE_BASIS_VALUES,
  type Confidence,
  type ConfidenceBasis,
  ENTERPRISE_KNOWLEDGE_POLICY,
  EXPOSURE_AUDIENCES,
  type ExposureAudience,
  KNOWLEDGE_ATOM_KINDS,
  KNOWLEDGE_DOMAINS,
  KNOWLEDGE_INTEGRITY_DIMENSIONS,
  KNOWLEDGE_LIFECYCLE_STATUSES,
  KNOWLEDGE_RELATIONSHIP_TYPES,
  type KnowledgeApplicability,
  type KnowledgeAtom,
  type KnowledgeAtomKind,
  type KnowledgeDecision,
  type KnowledgeDomain,
  type KnowledgeExposure,
  type KnowledgeImplementationMapping,
  type KnowledgeIntegrityDimension,
  type KnowledgeIntegrityProfile,
  type KnowledgeLifecycleStatus,
  type KnowledgeLineage,
  type KnowledgeMeaning,
  type KnowledgeMisconception,
  /** @deprecated Use KnowledgeEdge from knowledge-edge.contract */
  type KnowledgeRelationship,
  /** @deprecated Use KnowledgeEdgeType from knowledge-edge.contract */
  type KnowledgeRelationshipType,
} from "./contracts/knowledge-atom.contract.js";
// ── Knowledge Edge (B25 — replaces KnowledgeRelationship for new code) ──────
export {
  KNOWLEDGE_EDGE_TYPES,
  type KnowledgeEdge,
  type KnowledgeEdgeType,
} from "./contracts/knowledge-edge.contract.js";
// ── Knowledge Evidence (B25 — typed evidence, replaces string[] in atoms) ───
export {
  KNOWLEDGE_EVIDENCE_TYPES,
  type KnowledgeEvidence,
  type KnowledgeEvidenceType,
} from "./contracts/knowledge-evidence.contract.js";
// ── Knowledge Reasoning (B25 — structured reasoning node) ───────────────────
export type { KnowledgeReasoning } from "./contracts/knowledge-reasoning.contract.js";
// ── Authority registry (B25) ─────────────────────────────────────────────────
export {
  ACCEPTING_AUTHORITY_ENTITIES,
  type AcceptingAuthorityId,
  getAcceptingAuthority,
  isAcceptingAuthorityId,
  isResolvableAcceptingAuthorityRef,
  resolveAcceptingAuthorityRef,
} from "./data/accepting-authority.registry.js";
// ── Atom data ────────────────────────────────────────────────────────────────
export {
  B24_KNOWLEDGE_ATOM_IDS,
  B29_PLATFORM_ATOM_IDS,
  B31_CONTEXT_ATOM_IDS,
  ENTERPRISE_KNOWLEDGE_ATOMS,
  ENTERPRISE_KNOWLEDGE_FINGERPRINT,
  KNOWLEDGE_ATOM_IDS,
  type KnowledgeAtomId,
} from "./data/knowledge.registry.js";
// ── Edge data (B25 — authoritative) ─────────────────────────────────────────
export { KNOWLEDGE_EDGES } from "./data/knowledge-edge.registry.js";
// ── Relationship data (@deprecated — B24 backward compat) ───────────────────
export { KNOWLEDGE_RELATIONSHIPS } from "./data/knowledge-relationships.registry.js";

// ── Policy ───────────────────────────────────────────────────────────────────
export {
  getKnowledgeAtom,
  getKnowledgeEdgesForAtom,
  /** @deprecated Use getKnowledgeEdgesForAtom */
  getKnowledgeRelationshipsForAtom,
  isAcceptedOrLaterLifecycle,
  isKnowledgeAtomId,
  isRatifiedOrLaterLifecycle,
  validateKnowledgeAtom,
  validateKnowledgeRegistry,
} from "./policy/knowledge.policy.js";
export {
  buildTypedEvidenceFromLegacyPaths,
  getKernelEvidencePaths as getTypedKernelEvidencePaths,
  getKnowledgeEvidenceSources,
  inferEvidenceTypeForPath,
  isImplementationEvidenceSource,
} from "./policy/knowledge-evidence-paths.policy.js";
export {
  getKernelEvidencePaths,
  isKernelEvidencePath,
  isProhibitedKernelEvidencePath,
  KERNEL_EVIDENCE_PATH_PREFIX,
  validateKnowledgeKernelMapping,
} from "./policy/knowledge-kernel-mapping.policy.js";
export {
  deriveKnowledgeIntegrityScore,
  deriveKnowledgeQualityScore,
  isFullyIntegrityVerifiedAtom,
  isProductionCandidateQualityAtom,
} from "./policy/knowledge-quality.policy.js";
