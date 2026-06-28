/**
 * PAS-004A §4.6 — Knowledge Evidence contract.
 *
 * Replaces the flat `evidence: readonly string[]` path list on KnowledgeAtom
 * with a typed, temporal evidence record that names its source, clause, and
 * effective range. Backward-compat string paths remain on KnowledgeAtom.evidence
 * until B29 migrates existing atom data.
 */

export const KNOWLEDGE_EVIDENCE_TYPES = [
  "standard",
  "regulation",
  "decision",
  "sop",
  "adr",
  "resolution",
  "research",
  "policy",
] as const;

export type KnowledgeEvidenceType = (typeof KNOWLEDGE_EVIDENCE_TYPES)[number];

export interface KnowledgeEvidence {
  /** Specific clause, section, or article within the source. */
  readonly citation?: string;
  /** ISO 8601 date when this evidence became effective. */
  readonly effectiveDate?: string;
  readonly evidenceId: string;
  /** ISO 8601 date when this evidence expired. Omit if still current. */
  readonly expiredDate?: string;
  /** Authoritative name of the source document, e.g. "IAS 1", "ADR-0017". */
  readonly source: string;
  readonly type: KnowledgeEvidenceType;
  readonly url?: string;
}
