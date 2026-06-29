import { describe, expect, it } from "vitest";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import { getKnowledgeAtom } from "../policy/knowledge.policy.js";
import {
  validateAtomEpistemicFacets,
  validateKnowledgeEpistemicFacets,
} from "../policy/knowledge-epistemic.policy.js";
import { projectKnowledgeAtom } from "../projection/knowledge-consumer.projection.js";

describe("PAS-004D — epistemic facets", () => {
  it("every registry atom carries epistemicStatus and semanticStability", () => {
    for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
      expect(atom.epistemicStatus).toBeTruthy();
      expect(atom.semanticStability).toBeTruthy();
    }
  });

  it("validateKnowledgeEpistemicFacets passes for corpus", () => {
    expect(validateKnowledgeEpistemicFacets()).toEqual([]);
  });

  it("metadata and ai projections surface epistemic + stability facets", () => {
    const metadata = projectKnowledgeAtom("tenant", "metadata");
    expect(metadata).toMatchObject({
      atomId: "tenant",
      epistemicStatus: "accepted",
      semanticStability: "stable",
      exposureAudience: expect.any(String),
    });

    const ai = projectKnowledgeAtom("tenant", "ai");
    expect(ai).toMatchObject({
      atomId: "tenant",
      epistemicStatus: "accepted",
      semanticStability: "stable",
      exposureAudience: expect.any(String),
    });
  });

  it("rejects experimental stability with business-only exposure", () => {
    const atom = getKnowledgeAtom("tenant");
    const violations = validateAtomEpistemicFacets({
      ...atom,
      semanticStability: "experimental",
      exposure: { ...atom.exposure, audience: "business" },
    });
    expect(violations.length).toBeGreaterThan(0);
  });
});
