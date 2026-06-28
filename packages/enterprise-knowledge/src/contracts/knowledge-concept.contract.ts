/**
 * PAS-004C §4.1 — KnowledgeConcept contract.
 *
 * Stable enterprise idea separate from vocabulary surface forms (KnowledgeTerm)
 * and accepted contextual meaning (KnowledgeAtom).
 */

export const KNOWLEDGE_CONCEPT_OWNED_BY_PAS = "PAS-004C" as const;

export type KnowledgeConceptOwnedByPas = typeof KNOWLEDGE_CONCEPT_OWNED_BY_PAS;

export interface KnowledgeConcept {
  readonly conceptId: string;
  readonly description: string;
  readonly fqn: string;
  readonly label: string;
  readonly ownedByPas: KnowledgeConceptOwnedByPas;
}
