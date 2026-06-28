import { describe, expect, it } from "vitest";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import { KNOWLEDGE_EDGES } from "../data/knowledge-edge.registry.js";
import {
  getKnowledgeAtomsByDomain,
  getKnowledgeEdgesFrom,
  getSupersessionChain,
  resolveAcceptanceGraphRoots,
} from "../query/knowledge-graph.query.js";

describe("knowledge-graph.query (PAS-004B §4.3 · B36)", () => {
  it("getKnowledgeAtomsByDomain returns identity atoms", () => {
    const identityAtoms = getKnowledgeAtomsByDomain("identity");
    expect(identityAtoms.length).toBeGreaterThan(0);
    expect(
      identityAtoms.every((atom) => atom.knowledgeDomain.includes("identity"))
    ).toBe(true);
    expect(identityAtoms.some((atom) => atom.atomId === "tenant")).toBe(true);
  });

  it("getKnowledgeEdgesFrom filters outbound edges by type", () => {
    const containsEdges = getKnowledgeEdgesFrom("legal_entity", "contains");
    expect(containsEdges.length).toBeGreaterThan(0);
    expect(
      containsEdges.every(
        (edge) => edge.fromAtomId === "legal_entity" && edge.type === "contains"
      )
    ).toBe(true);

    const allEdges = getKnowledgeEdgesFrom("legal_entity");
    expect(allEdges.length).toBeGreaterThanOrEqual(containsEdges.length);
  });

  it("getSupersessionChain returns a single atom when no supersededBy", () => {
    const chain = getSupersessionChain("tenant");
    expect(chain).toHaveLength(1);
    expect(chain[0]?.atomId).toBe("tenant");
  });

  it("resolveAcceptanceGraphRoots returns all atoms when corpus has no supersession", () => {
    const roots = resolveAcceptanceGraphRoots();
    expect(roots.length).toBe(ENTERPRISE_KNOWLEDGE_ATOMS.length);
    expect(KNOWLEDGE_EDGES.some((edge) => edge.type === "supersedes")).toBe(
      false
    );
  });
});
