/**
 * PAS-004A §4.9 — Knowledge Edge contract.
 *
 * Renames KnowledgeRelationship → KnowledgeEdge, expands edge type vocabulary
 * to reflect Acceptance Graph semantics. Backward-compat alias exported from index.
 */

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
] as const;

export type KnowledgeEdgeType = (typeof KNOWLEDGE_EDGE_TYPES)[number];

export interface KnowledgeEdge {
  readonly edgeId: string;
  readonly fromAtomId: string;
  readonly note?: string;
  readonly toAtomId: string;
  readonly type: KnowledgeEdgeType;
}
