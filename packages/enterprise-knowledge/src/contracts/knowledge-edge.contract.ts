/**
 * PAS-004A §4.9 — Knowledge Edge contract.
 *
 * Renames KnowledgeRelationship → KnowledgeEdge, expands edge type vocabulary
 * to reflect Acceptance Graph semantics. Backward-compat alias exported from index.
 */

/** PAS-004C §4.7 — B42 semantic edge vocabulary (additive to acceptance-graph types). */
export const SEMANTIC_EDGE_TYPES = [
  "specializes",
  "generalizes",
  "equivalent",
  "implements",
  "realizes",
  "constrains",
  "depends_on",
  "references",
] as const;

export type SemanticEdgeType = (typeof SEMANTIC_EDGE_TYPES)[number];

export const KNOWLEDGE_EDGE_TYPES = [
  // original 9 — preserved for backward compatibility
  "contains",
  "owns",
  "operates",
  "stores",
  "governs",
  "derives_from",
  "related",
  "supersedes",
  "values",
  // new — Acceptance Graph edge vocabulary (B25)
  "accepts",
  "evidence_for",
  "evidence_against",
  "governed_by",
  "applicable_to",
  "validated_by",
  "explained_by",
  "contradicts",
  "requires",
  // new — Semantic model edge vocabulary (B42 — PAS-004C §4.7)
  ...SEMANTIC_EDGE_TYPES,
] as const;

export type KnowledgeEdgeType = (typeof KNOWLEDGE_EDGE_TYPES)[number];

export function isSemanticEdgeType(
  type: KnowledgeEdgeType
): type is SemanticEdgeType {
  return (SEMANTIC_EDGE_TYPES as readonly string[]).includes(type);
}

export interface KnowledgeEdge {
  readonly edgeId: string;
  readonly fromAtomId: string;
  /** B42 — term surface form for equivalent and other semantic edges. */
  readonly fromTermId?: string;
  readonly note?: string;
  readonly toAtomId: string;
  /** B42 — concept anchor for equivalent and other semantic edges. */
  readonly toConceptId?: string;
  readonly type: KnowledgeEdgeType;
}
