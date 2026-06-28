import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  isSemanticEdgeType,
  KNOWLEDGE_EDGE_TYPES,
  SEMANTIC_EDGE_TYPES,
} from "../contracts/knowledge-edge.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import {
  validateEdgeCorpus,
  validateSemanticEdgeCorpus,
} from "../data/knowledge-data.schema.js";
import { KNOWLEDGE_EDGES } from "../data/knowledge-edge.registry.js";
import {
  ENTERPRISE_KNOWLEDGE_CONCEPTS,
  ENTERPRISE_KNOWLEDGE_TERMS,
} from "../policy/knowledge-concept-vocabulary.policy.js";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dataDir = join(pkgRoot, "src/data");

function dirname(p: string): string {
  return p.slice(0, Math.max(p.lastIndexOf("/"), p.lastIndexOf("\\")) + 1);
}

describe("PAS-004C §4.7 — semantic edge vocabulary (B42)", () => {
  it("defines 8 semantic edge types in KNOWLEDGE_EDGE_TYPES", () => {
    expect(SEMANTIC_EDGE_TYPES).toEqual([
      "specializes",
      "generalizes",
      "equivalent",
      "implements",
      "realizes",
      "constrains",
      "depends_on",
      "references",
    ]);
    for (const edgeType of SEMANTIC_EDGE_TYPES) {
      expect(KNOWLEDGE_EDGE_TYPES).toContain(edgeType);
      expect(isSemanticEdgeType(edgeType)).toBe(true);
    }
  });

  it("includes ≥2 semantic edges in edges.json", () => {
    const semanticEdges = KNOWLEDGE_EDGES.filter((edge) =>
      isSemanticEdgeType(edge.type)
    );
    expect(semanticEdges.length).toBeGreaterThanOrEqual(2);
  });

  it("equivalent edges link B38 terms to concepts", () => {
    const equivalentEdges = KNOWLEDGE_EDGES.filter(
      (edge) => edge.type === "equivalent"
    );
    expect(equivalentEdges.length).toBeGreaterThanOrEqual(1);

    for (const edge of equivalentEdges) {
      expect(edge.fromTermId).toBeDefined();
      expect(edge.toConceptId).toBeDefined();
      const term = ENTERPRISE_KNOWLEDGE_TERMS.find(
        (candidate) => candidate.termId === edge.fromTermId
      );
      expect(term?.conceptId).toBe(edge.toConceptId);
      const concept = ENTERPRISE_KNOWLEDGE_CONCEPTS.find(
        (candidate) => candidate.conceptId === edge.toConceptId
      );
      expect(concept).toBeDefined();
    }
  });

  it("passes validateSemanticEdgeCorpus against authoritative edges.json", () => {
    const raw = JSON.parse(
      readFileSync(join(dataDir, "edges.json"), "utf8")
    ) as unknown[];
    const atomIds = new Set(
      ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) => atom.atomId)
    );
    const atomConceptById = new Map(
      ENTERPRISE_KNOWLEDGE_ATOMS.flatMap((atom) =>
        atom.conceptId ? [[atom.atomId, atom.conceptId] as const] : []
      )
    );
    const conceptIds = new Set(
      ENTERPRISE_KNOWLEDGE_CONCEPTS.map((concept) => concept.conceptId)
    );
    const termConceptById = new Map(
      ENTERPRISE_KNOWLEDGE_TERMS.map(
        (term) => [term.termId, term.conceptId] as const
      )
    );

    expect(validateEdgeCorpus(raw, atomIds)).toEqual([]);
    expect(
      validateSemanticEdgeCorpus(raw, {
        atomConceptById,
        conceptIds,
        termConceptById,
      })
    ).toEqual([]);
  });
});
