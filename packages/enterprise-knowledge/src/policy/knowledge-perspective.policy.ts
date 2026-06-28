/**
 * PAS-004C §4.2 — B39: contextual meaning perspective policy.
 */
import type { KnowledgeDomain } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgePerspective } from "../contracts/knowledge-perspective.contract.js";
import { getKnowledgeDomainClass } from "../data/domains.registry.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import { parsePerspectiveCorpus } from "../data/knowledge-perspective.loader.js";
import perspectivesJson from "../data/perspectives.json" with { type: "json" };
import { ENTERPRISE_KNOWLEDGE_CONCEPTS } from "./knowledge-concept-vocabulary.policy.js";

/** Platform identity perspectives required by PAS-004C §4.2 B39 DoD. */
export const PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS = [
  { conceptId: "legal_entity", domain: "accounting" as KnowledgeDomain },
  { conceptId: "legal_entity", domain: "identity" as KnowledgeDomain },
  { conceptId: "legal_entity", domain: "reporting" as KnowledgeDomain },
] as const;

const conceptIds = new Set(
  ENTERPRISE_KNOWLEDGE_CONCEPTS.map((concept) => concept.conceptId)
);

const atomIds = new Set(ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) => atom.atomId));

const atomById = new Map(
  ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) => [atom.atomId, atom] as const)
);

export const ENTERPRISE_KNOWLEDGE_PERSPECTIVES: readonly KnowledgePerspective[] =
  parsePerspectiveCorpus(perspectivesJson, conceptIds, atomIds);

export function getPerspectivesForConcept(
  conceptId: string
): readonly KnowledgePerspective[] {
  return ENTERPRISE_KNOWLEDGE_PERSPECTIVES.filter(
    (perspective) => perspective.conceptId === conceptId
  );
}

export function getKnowledgePerspective(
  perspectiveId: string
): KnowledgePerspective | undefined {
  return ENTERPRISE_KNOWLEDGE_PERSPECTIVES.find(
    (perspective) => perspective.perspectiveId === perspectiveId
  );
}

export function validateKnowledgePerspective(): readonly string[] {
  const errors: string[] = [];

  if (
    ENTERPRISE_KNOWLEDGE_PERSPECTIVES.length <
    PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS.length
  ) {
    errors.push(
      `perspectives.json: expected at least ${PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS.length} platform identity perspectives`
    );
  }

  for (const required of PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS) {
    const match = ENTERPRISE_KNOWLEDGE_PERSPECTIVES.find(
      (perspective) =>
        perspective.conceptId === required.conceptId &&
        perspective.domain === required.domain
    );
    if (!match) {
      errors.push(
        `perspectives.json: missing platform identity perspective for concept "${required.conceptId}" in domain "${required.domain}"`
      );
      continue;
    }
    const atom = atomById.get(match.atomId);
    if (!atom) {
      errors.push(
        `perspectives.json: perspective "${match.perspectiveId}" atomId "${match.atomId}" not found in atoms.json`
      );
    } else if (atom.conceptId !== match.conceptId) {
      errors.push(
        `perspectives.json: perspective "${match.perspectiveId}" atomId "${match.atomId}" conceptId "${atom.conceptId}" does not match perspective conceptId "${match.conceptId}"`
      );
    }
  }

  for (const perspective of ENTERPRISE_KNOWLEDGE_PERSPECTIVES) {
    const expectedDomainClass = getKnowledgeDomainClass(perspective.domain);
    if (perspective.domainClass !== expectedDomainClass) {
      errors.push(
        `perspectives.json: perspective "${perspective.perspectiveId}" domainClass "${perspective.domainClass}" does not match domains.registry.ts for domain "${perspective.domain}" (expected "${expectedDomainClass}")`
      );
    }
    if (!perspective.contextualLabel.trim()) {
      errors.push(
        `perspectives.json: perspective "${perspective.perspectiveId}" has empty contextualLabel`
      );
    }
  }

  return errors;
}
