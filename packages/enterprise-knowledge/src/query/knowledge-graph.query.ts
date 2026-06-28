/**
 * PAS-004B §4.3 / B36 — acceptance graph query helpers (exactly four exports).
 *
 * Pure functions over loaded JSON registries — not a graph engine.
 */
import type {
  KnowledgeAtom,
  KnowledgeDomain,
} from "../contracts/knowledge-atom.contract.js";
import type {
  KnowledgeEdge,
  KnowledgeEdgeType,
} from "../contracts/knowledge-edge.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import { KNOWLEDGE_EDGES } from "../data/knowledge-edge.registry.js";
import {
  getKnowledgeAtom,
  isKnowledgeAtomId,
} from "../policy/knowledge.policy.js";

export function getKnowledgeAtomsByDomain(
  domain: KnowledgeDomain
): readonly KnowledgeAtom[] {
  return ENTERPRISE_KNOWLEDGE_ATOMS.filter((atom) =>
    atom.knowledgeDomain.includes(domain)
  );
}

export function getKnowledgeEdgesFrom(
  atomId: string,
  type?: KnowledgeEdgeType
): readonly KnowledgeEdge[] {
  const edges = KNOWLEDGE_EDGES.filter((edge) => edge.fromAtomId === atomId);
  if (type === undefined) {
    return edges;
  }
  return edges.filter((edge) => edge.type === type);
}

export function getSupersessionChain(atomId: string): readonly KnowledgeAtom[] {
  if (!isKnowledgeAtomId(atomId)) {
    throw new Error(`Unknown knowledge atom: ${atomId}`);
  }

  const chain: KnowledgeAtom[] = [];
  let current: KnowledgeAtom = getKnowledgeAtom(atomId);
  chain.push(current);

  while (current.supersededBy !== undefined) {
    if (!isKnowledgeAtomId(current.supersededBy)) {
      break;
    }
    current = getKnowledgeAtom(current.supersededBy);
    chain.push(current);
  }

  return chain;
}

export function resolveAcceptanceGraphRoots(): readonly KnowledgeAtom[] {
  const supersededAtomIds = new Set<string>();

  for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
    if (atom.supersededBy !== undefined) {
      supersededAtomIds.add(atom.atomId);
    }
  }

  for (const edge of KNOWLEDGE_EDGES) {
    if (edge.type === "supersedes") {
      supersededAtomIds.add(edge.toAtomId);
    }
  }

  return ENTERPRISE_KNOWLEDGE_ATOMS.filter(
    (atom) => !supersededAtomIds.has(atom.atomId)
  );
}
