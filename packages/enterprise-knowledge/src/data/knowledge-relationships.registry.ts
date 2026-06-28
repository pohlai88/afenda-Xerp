/**
 * PAS-004A §4.9 — B25: backward-compat relationship adapter.
 *
 * @deprecated Use KNOWLEDGE_EDGES from knowledge-edge.registry.ts for new code.
 * KnowledgeRelationship type and KNOWLEDGE_RELATIONSHIPS constant are retained
 * for consumers written before B25. They will be removed in B26 once consumers migrate.
 *
 * Derived from KNOWLEDGE_EDGES — single JSON load path via knowledge-edge.registry.ts.
 */
import {
  KNOWLEDGE_RELATIONSHIP_TYPES,
  type KnowledgeRelationship,
  type KnowledgeRelationshipType,
} from "../contracts/knowledge-atom.contract.js";
import { KNOWLEDGE_EDGES } from "./knowledge-edge.registry.js";

function isKnowledgeRelationshipType(
  value: string
): value is KnowledgeRelationshipType {
  return (KNOWLEDGE_RELATIONSHIP_TYPES as readonly string[]).includes(value);
}

function toKnowledgeRelationship(
  edge: (typeof KNOWLEDGE_EDGES)[number]
): KnowledgeRelationship {
  if (!isKnowledgeRelationshipType(edge.type)) {
    throw new Error(
      `Edge ${edge.edgeId}: type "${edge.type}" is not a legacy KnowledgeRelationshipType`
    );
  }
  return {
    relationshipId: edge.edgeId,
    type: edge.type,
    fromAtomId: edge.fromAtomId,
    toAtomId: edge.toAtomId,
    ...(edge.note === undefined ? {} : { note: edge.note }),
  };
}

export const KNOWLEDGE_RELATIONSHIPS: readonly KnowledgeRelationship[] =
  KNOWLEDGE_EDGES.map(toKnowledgeRelationship);
