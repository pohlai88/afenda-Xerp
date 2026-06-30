/**
 * PAS-004D §4.4 — B52: vocabulary synonym richness validation policy.
 */
import type { KnowledgeTerm } from "../contracts/knowledge-term.contract.js";

/**
 * Platform identity concepts where PAS-004 charter lists honest synonyms.
 * Customer omitted — no standalone customer concept in corpus.
 */
export const B52_CHARTER_SYNONYM_CONCEPT_IDS = [
  "tenant",
  "legal_entity",
  "organization_unit",
  "workspace",
  "supplier",
] as const;

export type B52CharterSynonymConceptId =
  (typeof B52_CHARTER_SYNONYM_CONCEPT_IDS)[number];

export const B52_MIN_TERMS_PER_CONCEPT = 2 as const;

export const KNOWLEDGE_VOCABULARY_RICHNESS_RULE =
  "knowledge-vocabulary-richness-charter-synonym-min-two-terms" as const;

function countTermsForConcept(
  terms: readonly KnowledgeTerm[],
  conceptId: string
): number {
  return terms.filter((term) => term.conceptId === conceptId).length;
}

/**
 * PAS-004D B52 — validate ≥2 KnowledgeTerm rows per charter synonym concept.
 */
export function validateKnowledgeVocabularyRichness(
  terms: readonly KnowledgeTerm[]
): readonly string[] {
  const errors: string[] = [];

  for (const conceptId of B52_CHARTER_SYNONYM_CONCEPT_IDS) {
    const count = countTermsForConcept(terms, conceptId);
    if (count < B52_MIN_TERMS_PER_CONCEPT) {
      errors.push(
        `terms.json: concept "${conceptId}" requires ≥${B52_MIN_TERMS_PER_CONCEPT} KnowledgeTerm rows for charter synonyms (found ${count})`
      );
    }
  }

  return errors;
}

export function formatKnowledgeVocabularyRichnessErrors(
  errors: readonly string[]
): string {
  if (errors.length === 0) {
    return "knowledge-vocabulary-richness: PASS";
  }

  const lines = ["knowledge-vocabulary-richness: FAIL"];
  for (const error of errors) {
    lines.push(`  - ${error}`);
  }
  return lines.join("\n");
}
