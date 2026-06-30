#!/usr/bin/env tsx
/**
 * PAS-004D §4.4 — B52: vocabulary synonym richness gate.
 *
 * Validates ≥2 KnowledgeTerm rows per charter synonym concept in terms.json.
 */

import { ENTERPRISE_KNOWLEDGE_TERMS } from "../../packages/enterprise-knowledge/src/policy/knowledge-concept-vocabulary.policy.ts";
import {
  formatKnowledgeVocabularyRichnessErrors,
  KNOWLEDGE_VOCABULARY_RICHNESS_RULE,
  validateKnowledgeVocabularyRichness,
} from "../../packages/enterprise-knowledge/src/policy/knowledge-vocabulary-richness.policy.ts";

export function checkKnowledgeVocabularyRichness(): string[] {
  return [...validateKnowledgeVocabularyRichness(ENTERPRISE_KNOWLEDGE_TERMS)];
}

function main(): void {
  const errors = checkKnowledgeVocabularyRichness();

  if (errors.length > 0) {
    console.error(formatKnowledgeVocabularyRichnessErrors(errors));
    console.error(`vocabulary-richness-rule: ${KNOWLEDGE_VOCABULARY_RICHNESS_RULE}`);
    process.exit(1);
  }

  console.log(formatKnowledgeVocabularyRichnessErrors(errors));
  console.log(`vocabulary-richness-rule: ${KNOWLEDGE_VOCABULARY_RICHNESS_RULE}`);
}

main();
