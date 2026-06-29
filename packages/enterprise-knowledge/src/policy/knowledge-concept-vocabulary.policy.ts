/**
 * PAS-004C §4.1 — B38: concept + vocabulary conformance policy.
 */
import type { KnowledgeConcept } from "../contracts/knowledge-concept.contract.js";
import type { KnowledgeTerm } from "../contracts/knowledge-term.contract.js";
import conceptsJson from "../data/concepts.json" with { type: "json" };
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import { parseConceptCorpus } from "../data/knowledge-concept.loader.js";
import { parseTermCorpus } from "../data/knowledge-term.loader.js";
import termsJson from "../data/terms.json" with { type: "json" };

/** Platform identity concepts required by PAS-004C §4.1 B38 DoD. */
export const PLATFORM_IDENTITY_CONCEPT_IDS = [
  "legal_entity",
  "organization_unit",
  "workspace",
  "surface",
  "tenant",
  "invariant",
] as const;

export type PlatformIdentityConceptId =
  (typeof PLATFORM_IDENTITY_CONCEPT_IDS)[number];

export const ENTERPRISE_KNOWLEDGE_CONCEPTS: readonly KnowledgeConcept[] =
  parseConceptCorpus(conceptsJson);

const conceptIds = new Set(
  ENTERPRISE_KNOWLEDGE_CONCEPTS.map((concept) => concept.conceptId)
);

export const ENTERPRISE_KNOWLEDGE_TERMS: readonly KnowledgeTerm[] =
  parseTermCorpus(termsJson, conceptIds);

export function getKnowledgeConcept(
  conceptId: string
): KnowledgeConcept | undefined {
  return ENTERPRISE_KNOWLEDGE_CONCEPTS.find(
    (concept) => concept.conceptId === conceptId
  );
}

export function getPreferredTermForConcept(
  conceptId: string
): KnowledgeTerm | undefined {
  return ENTERPRISE_KNOWLEDGE_TERMS.find(
    (term) => term.conceptId === conceptId && term.preferred
  );
}

export function validateKnowledgeConceptVocabulary(): readonly string[] {
  const errors: string[] = [];

  for (const required of PLATFORM_IDENTITY_CONCEPT_IDS) {
    if (!conceptIds.has(required)) {
      errors.push(
        `concepts.json: missing platform identity concept "${required}"`
      );
    }
  }

  for (const concept of ENTERPRISE_KNOWLEDGE_CONCEPTS) {
    const preferredTerms = ENTERPRISE_KNOWLEDGE_TERMS.filter(
      (term) => term.conceptId === concept.conceptId && term.preferred
    );
    if (preferredTerms.length === 0) {
      errors.push(
        `terms.json: concept "${concept.conceptId}" has no preferred term`
      );
    }
    if (preferredTerms.length > 1) {
      errors.push(
        `terms.json: concept "${concept.conceptId}" has multiple preferred terms`
      );
    }
  }

  for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
    if (!atom.conceptId) {
      errors.push(`${atom.atomId}: missing conceptId (required after B38)`);
      continue;
    }
    if (!conceptIds.has(atom.conceptId)) {
      errors.push(
        `${atom.atomId}: conceptId "${atom.conceptId}" not found in concepts.json`
      );
    }
  }

  const atomsMissingConcept = ENTERPRISE_KNOWLEDGE_ATOMS.filter(
    (atom) => !atom.conceptId
  ).length;
  if (atomsMissingConcept > 0) {
    errors.push(
      `atoms.json: ${atomsMissingConcept}/${ENTERPRISE_KNOWLEDGE_ATOMS.length} atoms missing conceptId`
    );
  }

  return errors;
}
