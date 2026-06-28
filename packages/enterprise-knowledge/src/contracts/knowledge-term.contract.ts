/**
 * PAS-004C §4.1 — KnowledgeTerm contract.
 *
 * Vocabulary surface form linked to a KnowledgeConcept. Synonyms become terms,
 * not duplicate atoms.
 */
import type { KnowledgeConceptOwnedByPas } from "./knowledge-concept.contract.js";

export interface KnowledgeTerm {
  readonly conceptId: string;
  readonly label: string;
  readonly locale?: string;
  readonly ownedByPas: KnowledgeConceptOwnedByPas;
  readonly preferred: boolean;
  readonly termId: string;
}
