import { describe, expect, it } from "vitest";

import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import {
  deriveKnowledgeIntegrityScore,
  deriveKnowledgeQualityScore,
  isFullyIntegrityVerifiedAtom,
  isProductionCandidateQualityAtom,
} from "../policy/knowledge-quality.policy.js";

describe("Knowledge quality derivation (PAS-004A B29)", () => {
  it("returns 100 for MVP seed atoms with complete integrity profiles", () => {
    for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
      expect(deriveKnowledgeIntegrityScore(atom)).toBe(100);
      expect(isFullyIntegrityVerifiedAtom(atom)).toBe(true);
    }
  });

  it("derives composite quality score from integrity, evidence, and reasoning", () => {
    for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
      expect(deriveKnowledgeQualityScore(atom)).toBeGreaterThanOrEqual(90);
      expect(isProductionCandidateQualityAtom(atom)).toBe(true);
    }
  });

  it("returns partial score when integrity dimensions are incomplete", () => {
    const atom = ENTERPRISE_KNOWLEDGE_ATOMS[0];
    if (!atom) {
      throw new Error("expected seed atom");
    }

    const partial = {
      ...atom,
      integrity: {
        ...atom.integrity,
        correctness: false,
      },
    };

    expect(deriveKnowledgeIntegrityScore(partial)).toBeLessThan(100);
    expect(isFullyIntegrityVerifiedAtom(partial)).toBe(false);
  });
});
