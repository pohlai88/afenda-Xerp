/**
 * PAS-004C §4.2 — KnowledgePerspective contract.
 *
 * Contextual accepted meaning: Concept × Domain → atomId + contextualLabel.
 * domainClass on perspectives aligns with domains.registry.ts (B40 authoritative axis).
 */

import type { KnowledgeDomain } from "./knowledge-atom.contract.js";

export const KNOWLEDGE_PERSPECTIVE_OWNED_BY_PAS = "PAS-004C" as const;

export type KnowledgePerspectiveOwnedByPas =
  typeof KNOWLEDGE_PERSPECTIVE_OWNED_BY_PAS;

/** Domain-axis class — full registry in B40 domains.registry.ts. */
export const KNOWLEDGE_DOMAIN_CLASSES = [
  "business",
  "architecture",
  "knowledge",
] as const;

export type KnowledgeDomainClass = (typeof KNOWLEDGE_DOMAIN_CLASSES)[number];

export interface KnowledgePerspective {
  readonly atomId: string;
  readonly conceptId: string;
  readonly contextualLabel: string;
  readonly domain: KnowledgeDomain;
  readonly domainClass: KnowledgeDomainClass;
  readonly ownedByPas: KnowledgePerspectiveOwnedByPas;
  readonly perspectiveId: string;
}
