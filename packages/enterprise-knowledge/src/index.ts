/** PAS-004 / PAS-004A / PAS-004B — @afenda/enterprise-knowledge public surface. */

export const ENTERPRISE_KNOWLEDGE_PACKAGE_VERSION = "0.0.0" as const;

export { COMPLETE_INTEGRITY_PROFILE } from "./constants/knowledge-integrity.js";
// ── Constants ────────────────────────────────────────────────────────────────
export { KNOWLEDGE_REGISTRY_LOADER_MAX_LINES } from "./constants/knowledge-json-authority.js";
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
  type ContextualValidity,
  ENTERPRISE_KNOWLEDGE_POLICY,
  EPISTEMIC_STATUSES,
  type EpistemicStatus,
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
  SEMANTIC_STABILITY_LEVELS,
  type SemanticStabilityLevel,
} from "./contracts/knowledge-atom.contract.js";
// ── Knowledge Concept + Term (B38 — PAS-004C §4.1) ─────────────────────────
export {
  KNOWLEDGE_CONCEPT_OWNED_BY_PAS,
  type KnowledgeConcept,
  type KnowledgeConceptOwnedByPas,
} from "./contracts/knowledge-concept.contract.js";
// ── Knowledge Consumer Profile (B43 — PAS-004C §4.3) ───────────────────────
export {
  isKnowledgeConsumerProfile,
  KNOWLEDGE_CONSUMER_PROFILES,
  type KnowledgeConsumerProfile,
} from "./contracts/knowledge-consumer-profile.contract.js";
// ── Knowledge Domain Registry (B40 — PAS-004C §4.5) ────────────────────────
export type { KnowledgeDomainEntry } from "./contracts/knowledge-domain-registry.contract.js";
// ── Knowledge Edge (B25 — replaces KnowledgeRelationship for new code) ──────
export {
  isSemanticEdgeType,
  KNOWLEDGE_EDGE_TYPES,
  type KnowledgeEdge,
  type KnowledgeEdgeType,
  SEMANTIC_EDGE_TYPES,
  type SemanticEdgeType,
} from "./contracts/knowledge-edge.contract.js";
// ── Knowledge Evidence (B25 — typed evidence, replaces string[] in atoms) ───
export {
  KNOWLEDGE_EVIDENCE_TYPES,
  type KnowledgeEvidence,
  type KnowledgeEvidenceType,
} from "./contracts/knowledge-evidence.contract.js";
// ── Knowledge Perspective (B39 — PAS-004C §4.2) ────────────────────────────
export {
  KNOWLEDGE_DOMAIN_CLASSES,
  KNOWLEDGE_PERSPECTIVE_OWNED_BY_PAS,
  type KnowledgeDomainClass,
  type KnowledgePerspective,
  type KnowledgePerspectiveOwnedByPas,
} from "./contracts/knowledge-perspective.contract.js";
// ── Knowledge Realization (B44 — PAS-004C §4.4) ────────────────────────────
export {
  type KnowledgeRealizationMapping,
  REALIZATION_KINDS,
  type RealizationKind,
} from "./contracts/knowledge-realization.contract.js";
// ── Knowledge Reasoning (B25 — structured reasoning node) ───────────────────
export type { KnowledgeReasoning } from "./contracts/knowledge-reasoning.contract.js";
export type { KnowledgeTerm } from "./contracts/knowledge-term.contract.js";
// ── Knowledge Transition (B45 — PAS-004C §4.8) ───────────────────────────
export type {
  KnowledgeTransitionRule,
  LifecycleTransitionResult,
} from "./contracts/knowledge-transition.contract.js";
// ── Authority registry (B25) ─────────────────────────────────────────────────
export {
  ACCEPTING_AUTHORITY_ENTITIES,
  type AcceptingAuthorityId,
  getAcceptingAuthority,
  isAcceptingAuthorityId,
  isResolvableAcceptingAuthorityRef,
  resolveAcceptingAuthorityRef,
} from "./data/accepting-authority.registry.js";
export {
  getKnowledgeDomainClass,
  getKnowledgeDomainEntry,
  KNOWLEDGE_DOMAIN_ENTRIES,
} from "./data/domains.registry.js";
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
export { parseConceptCorpus } from "./data/knowledge-concept.loader.js";
// ── Edge data (B25 — authoritative) ─────────────────────────────────────────
export { KNOWLEDGE_EDGES } from "./data/knowledge-edge.registry.js";
export { parsePerspectiveCorpus } from "./data/knowledge-perspective.loader.js";
export { parseTermCorpus } from "./data/knowledge-term.loader.js";
export {
  getKnowledgeTransitionRule,
  KNOWLEDGE_TRANSITION_RULES,
  type KnowledgeTransitionRuleId,
} from "./data/transition-rules.registry.js";

// ── Policy ───────────────────────────────────────────────────────────────────
export {
  getKnowledgeAtom,
  getKnowledgeEdgesForAtom,
  /** @deprecated Use getKnowledgeEdgesForAtom */
  getKnowledgeRelationshipsForAtom,
  isAcceptedOrLaterLifecycle,
  isKnowledgeAtomId,
  isRatifiedOrLaterLifecycle,
  /** @deprecated B50 — derived from KNOWLEDGE_EDGES */
  KNOWLEDGE_RELATIONSHIPS,
  validateKnowledgeAtom,
  validateKnowledgeRegistry,
} from "./policy/knowledge.policy.js";
export {
  ENTERPRISE_KNOWLEDGE_CONCEPTS,
  ENTERPRISE_KNOWLEDGE_TERMS,
  getKnowledgeConcept,
  getPreferredTermForConcept,
  PLATFORM_IDENTITY_CONCEPT_IDS,
  type PlatformIdentityConceptId,
  validateKnowledgeConceptVocabulary,
} from "./policy/knowledge-concept-vocabulary.policy.js";
export {
  CONFLICTING_FRAMEWORK_BASES,
  CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS,
  hasConflictingFrameworkBasis,
  requiresContextualValidity,
  validateAtomContextualValidity,
  validateContextualValidity,
} from "./policy/knowledge-contextual-validity.policy.js";
export {
  ARCHITECTURE_KNOWLEDGE_DOMAINS,
  BUSINESS_KNOWLEDGE_DOMAINS,
  filterByDomainClass,
  getKnowledgeDomainsByClass,
  validateKnowledgeDomainAxis,
} from "./policy/knowledge-domain-axis.policy.js";
export {
  validateAtomEpistemicFacets,
  validateKnowledgeEpistemicFacets,
} from "./policy/knowledge-epistemic.policy.js";
export {
  buildTypedEvidenceFromLegacyPaths,
  getKernelEvidencePaths as getTypedKernelEvidencePaths,
  getKnowledgeEvidenceSources,
  inferEvidenceTypeForPath,
  isImplementationEvidenceSource,
} from "./policy/knowledge-evidence-paths.policy.js";
export {
  isIdentityConstitutionEvidencePath,
  isPlatformIdentityAtomId,
  KERNEL_IDENTITY_PATH_PREFIX,
  PLATFORM_ENTITY_KERNEL_CONTRACT_PATHS,
  PLATFORM_IDENTITY_ATOM_IDS,
  type PlatformIdentityAtomId,
  REQUIRED_IDENTITY_BRANDED_IDS,
  validateKnowledgeKernelIdentityMapping,
} from "./policy/knowledge-kernel-identity-mapping.policy.js";
export {
  getKernelEvidencePaths,
  isKernelEvidencePath,
  isProhibitedKernelEvidencePath,
  KERNEL_EVIDENCE_PATH_PREFIX,
  validateKnowledgeKernelMapping,
} from "./policy/knowledge-kernel-mapping.policy.js";
export {
  ENTERPRISE_KNOWLEDGE_PERSPECTIVES,
  getKnowledgePerspective,
  getPerspectivesForConcept,
  PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS,
  validateKnowledgePerspective,
} from "./policy/knowledge-perspective.policy.js";
export {
  deriveKnowledgeIntegrityScore,
  deriveKnowledgeQualityScore,
  isFullyIntegrityVerifiedAtom,
  isProductionCandidateQualityAtom,
} from "./policy/knowledge-quality.policy.js";
export {
  collectRealizationKinds,
  getAtomRealizationMappings,
  REALIZATION_MAPPING_EVIDENCE_ATOM_IDS,
  validateKnowledgeRealizationMapping,
} from "./policy/knowledge-realization.policy.js";
export {
  canTransitionLifecycle,
  hasArchitectureAuthorityInChain,
  validateAtomLifecycleCompliance,
  validateKnowledgeLifecycleTransitions,
} from "./policy/knowledge-transition.policy.js";
// ── Consumer projection (B43 — PAS-004C §4.3) ──────────────────────────────
export {
  type AiKnowledgeEvidenceCitationProjection,
  type AiKnowledgeProjection,
  type DocsKnowledgeProjection,
  type ErpKnowledgeProjection,
  isJsonSerializableProjection,
  KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS,
  type KnowledgeConsumerProjection,
  type MetadataKnowledgeProjection,
  projectKnowledgeAtom,
  type ReportKnowledgeProjection,
  validateKnowledgeConsumerProfiles,
} from "./projection/knowledge-consumer.projection.js";
export {
  getKnowledgeAtomsByDomain,
  getKnowledgeEdgesFrom,
  getSupersessionChain,
  resolveAcceptanceGraphRoots,
} from "./query/knowledge-graph.query.js";
