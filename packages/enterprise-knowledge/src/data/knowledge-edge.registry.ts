/**
 * PAS-004A §4.9 — B25: Knowledge Edge loader (authoritative).
 *
 * edges.json is the authoritative corpus. KnowledgeEdge replaces KnowledgeRelationship
 * for all new code. The edgeId field replaces relationshipId.
 */
import type { KnowledgeEdge } from "../contracts/knowledge-edge.contract.js";
import edgesJson from "./edges.json" with { type: "json" };
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "./knowledge.registry.js";
import { parseEdgeCorpus } from "./knowledge-data.loader.js";

const atomIds = new Set(ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) => atom.atomId));

export const KNOWLEDGE_EDGES: readonly KnowledgeEdge[] = parseEdgeCorpus(
  edgesJson,
  atomIds
);
