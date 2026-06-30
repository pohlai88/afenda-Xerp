import { describe, expect, it } from "vitest";

import type { KnowledgeTerm } from "../../../packages/enterprise-knowledge/src/contracts/knowledge-term.contract.js";
import { ENTERPRISE_KNOWLEDGE_TERMS } from "../../../packages/enterprise-knowledge/src/policy/knowledge-concept-vocabulary.policy.ts";
import {
  B52_CHARTER_SYNONYM_CONCEPT_IDS,
  B52_MIN_TERMS_PER_CONCEPT,
  formatKnowledgeVocabularyRichnessErrors,
  KNOWLEDGE_VOCABULARY_RICHNESS_RULE,
  validateKnowledgeVocabularyRichness,
} from "../../../packages/enterprise-knowledge/src/policy/knowledge-vocabulary-richness.policy.ts";
import { checkKnowledgeVocabularyRichness } from "../check-knowledge-vocabulary-richness.mts";

describe("check-knowledge-vocabulary-richness", () => {
  it("passes on the current repository state", () => {
    const errors = checkKnowledgeVocabularyRichness();
    expect(errors, formatKnowledgeVocabularyRichnessErrors(errors)).toEqual([]);
  });

  it("exports the vocabulary richness rule identifier", () => {
    expect(KNOWLEDGE_VOCABULARY_RICHNESS_RULE).toBe(
      "knowledge-vocabulary-richness-charter-synonym-min-two-terms"
    );
  });

  it("requires ≥2 terms for each charter synonym concept", () => {
    for (const conceptId of B52_CHARTER_SYNONYM_CONCEPT_IDS) {
      const count = ENTERPRISE_KNOWLEDGE_TERMS.filter(
        (term) => term.conceptId === conceptId
      ).length;
      expect(count).toBeGreaterThanOrEqual(B52_MIN_TERMS_PER_CONCEPT);
    }
  });

  it("fails when a charter synonym concept has only one term", () => {
    const sparseTerms: KnowledgeTerm[] = ENTERPRISE_KNOWLEDGE_TERMS.filter(
      (term) => term.conceptId !== "tenant"
    );

    const errors = validateKnowledgeVocabularyRichness(sparseTerms);

    expect(errors.some((error) => error.includes('"tenant"'))).toBe(true);
  });
});
