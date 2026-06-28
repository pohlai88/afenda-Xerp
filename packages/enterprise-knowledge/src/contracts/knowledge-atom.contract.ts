/**
 * PAS-004 / PAS-004A — enterprise knowledge atom vocabulary (serializable only).
 *
 * B25 additions (PAS-004A §4.8 / §4.9):
 *   - `under_review` added to KNOWLEDGE_LIFECYCLE_STATUSES
 *   - effectiveFrom / effectiveUntil / version / supersededBy on KnowledgeAtom
 *   - KnowledgeRelationship backward-compat alias → import KnowledgeEdge from
 *     knowledge-edge.contract.ts for new code
 *
 * B29: `typedEvidence` + `structuredReasoning` replace legacy string evidence/reasoning.
 */
import type { KnowledgeEvidence } from "./knowledge-evidence.contract.js";
import type { KnowledgeReasoning } from "./knowledge-reasoning.contract.js";

export const KNOWLEDGE_ATOM_KINDS = [
  "concept",
  "vocabulary",
  "principle",
  "rule",
  "decision",
  "pattern",
  "standard",
  "relationship",
] as const;

export type KnowledgeAtomKind = (typeof KNOWLEDGE_ATOM_KINDS)[number];

export const ACCEPTING_AUTHORITIES = [
  "board",
  "architecture_authority",
  "accounting_authority",
  "legal_authority",
  "erp_authority",
  "standard_body",
  "external_source",
] as const;

export type AcceptingAuthority = (typeof ACCEPTING_AUTHORITIES)[number];

export const ACCEPTANCE_CHAIN_STEPS = [
  "origin",
  "observed",
  "proposed",
  "under_review",
  "accepted",
  "ratified",
  "implemented",
  "superseded",
  "historical",
] as const;

export type AcceptanceChainStep = (typeof ACCEPTANCE_CHAIN_STEPS)[number];

export const AUTHORITY_TYPES = [
  "standard",
  "regulatory",
  "legal",
  "corporate",
  "architectural",
  "operational",
  "engineering",
  "informative",
] as const;

export type AuthorityType = (typeof AUTHORITY_TYPES)[number];

export const BINDING_LEVELS = [
  "mandatory",
  "recommended",
  "optional",
  "historical",
] as const;

export type BindingLevel = (typeof BINDING_LEVELS)[number];

export const CONFIDENCE_BASIS_VALUES = [
  "IFRS",
  "GAAP",
  "ISO",
  "SAP",
  "Oracle",
  "afenda_decision",
  "engineering_convention",
] as const;

export type ConfidenceBasis = (typeof CONFIDENCE_BASIS_VALUES)[number];

export const KNOWLEDGE_DOMAINS = [
  "accounting",
  "taxation",
  "manufacturing",
  "security",
  "identity",
  "platform",
  "architecture",
  "inventory",
  "hr",
  "ai",
  "integration",
  "finance",
  "reporting",
  "consolidation",
  "engineering",
  "networking",
  "api",
] as const;

export type KnowledgeDomain = (typeof KNOWLEDGE_DOMAINS)[number];

export const KNOWLEDGE_LIFECYCLE_STATUSES = [
  "observed",
  "proposed",
  "under_review", // B25: PAS-004 §3.1 amended — accepting authority is evaluating
  "accepted",
  "ratified",
  "implemented",
  "superseded",
  "historical",
] as const;

export type KnowledgeLifecycleStatus =
  (typeof KNOWLEDGE_LIFECYCLE_STATUSES)[number];

export const KNOWLEDGE_RELATIONSHIP_TYPES = [
  "contains",
  "owns",
  "operates",
  "stores",
  "governs",
  "derives_from",
  "related",
  "supersedes",
  "values",
] as const;

export type KnowledgeRelationshipType =
  (typeof KNOWLEDGE_RELATIONSHIP_TYPES)[number];

export const EXPOSURE_AUDIENCES = [
  "business",
  "engineering_only",
  "both",
] as const;

export type ExposureAudience = (typeof EXPOSURE_AUDIENCES)[number];

export const KNOWLEDGE_INTEGRITY_DIMENSIONS = [
  "correctness",
  "completeness",
  "consistency",
  "authority",
  "acceptance",
  "evidence",
  "reasoning",
  "applicability",
  "evolution",
  "relationship",
] as const;

export type KnowledgeIntegrityDimension =
  (typeof KNOWLEDGE_INTEGRITY_DIMENSIONS)[number];

export type KnowledgeIntegrityProfile = Readonly<
  Record<KnowledgeIntegrityDimension, boolean>
>;

export interface AcceptanceChainEntry {
  readonly by: AcceptingAuthority | string;
  readonly evidence?: readonly string[];
  readonly on?: string;
  readonly step: AcceptanceChainStep;
}

export interface Confidence {
  readonly basis: readonly ConfidenceBasis[];
  readonly score: number;
}

export interface KnowledgeDecision {
  readonly alternativesConsidered: readonly string[];
  readonly decision: string;
  readonly impact: readonly string[];
  readonly whyRejected: Readonly<Record<string, string>>;
}

export interface KnowledgeMeaning {
  readonly business: string;
  readonly canonical: string;
  readonly engineering: string;
}

export interface KnowledgeApplicability {
  readonly applicable: readonly KnowledgeDomain[];
  readonly exceptions: readonly string[];
  readonly notApplicable: readonly KnowledgeDomain[];
}

export interface KnowledgeLineage {
  readonly currentAuthority: string;
  readonly evolution: readonly string[];
  readonly futureDirection: string;
  readonly origin: string;
}

export interface KnowledgeMisconception {
  readonly confusedWith: string;
  readonly correct: string;
  readonly why: string;
}

export interface KnowledgeExposure {
  readonly afendaPreferredWording: string;
  readonly audience: ExposureAudience;
}

export interface KnowledgeImplementationMapping {
  /** PAS-004B §4.1 — ADR-0021 branded ID name cited by platform identity atoms. */
  readonly brandedId?: string;
  /** PAS-004B §4.1 — repo-relative kernel contract path for platform identity atoms. */
  readonly contractPath?: string;
  readonly databaseTable?: string;
  readonly operatingContextField?: string;
  readonly persistenceClass:
    | "persisted"
    | "derived"
    | "deferred"
    | "authority_only";
  readonly runtimeStatus:
    | "implemented"
    | "partial"
    | "planned"
    | "authority_only";
  readonly upstreamContract?: string;
}

export interface KnowledgeAtom {
  readonly acceptanceChain: readonly AcceptanceChainEntry[];
  readonly applicability: KnowledgeApplicability;
  readonly atomId: string;
  readonly authorityType: AuthorityType;
  readonly binding: BindingLevel;
  readonly confidence: Confidence;
  // PAS-004A §4.8 — effective time (optional; required on atoms where lifecycle governs temporal meaning)
  readonly effectiveFrom?: string; // ISO 8601
  readonly effectiveUntil?: string; // ISO 8601 — omit if still current
  readonly exposure: KnowledgeExposure;
  readonly fqn: string;
  readonly implementationMapping?: KnowledgeImplementationMapping;
  readonly integrity: KnowledgeIntegrityProfile;
  readonly kind: KnowledgeAtomKind;
  readonly knowledgeDecision: KnowledgeDecision;
  readonly knowledgeDomain: readonly KnowledgeDomain[];
  readonly lifecycle: KnowledgeLifecycleStatus;
  readonly lineage: KnowledgeLineage;
  readonly meaning: KnowledgeMeaning;
  readonly misconceptions: readonly KnowledgeMisconception[];
  readonly ownedByPas: "PAS-004";
  readonly structuredReasoning: KnowledgeReasoning;
  readonly supersededBy?: string; // atomId of the replacement
  readonly typedEvidence: readonly KnowledgeEvidence[];
  readonly version?: string; // human-readable label, e.g. "IFRS 17 (2017)"
}

/**
 * @deprecated B25 — use KnowledgeEdge from knowledge-edge.contract.ts for new code.
 * Retained for backward compatibility with B24 edge registry.
 */
export interface KnowledgeRelationship {
  readonly fromAtomId: string;
  readonly note?: string;
  readonly relationshipId: string;
  readonly toAtomId: string;
  readonly type: KnowledgeRelationshipType;
}

export const ENTERPRISE_KNOWLEDGE_POLICY = {
  pasSection: "4.1",
  charterDoc: "docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  constitutionalSentence:
    "Enterprise knowledge exists when meaning is accepted, reasoning is understood, evidence is trusted, relationships are preserved, decisions are explainable, and evolution is traceable.",
  firstPrinciple:
    "Knowledge becomes authoritative through acceptance by an accepted authority, supported by evidence, within a defined domain.",
} as const;
