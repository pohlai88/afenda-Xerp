/**
 * PAS-004C §4.5 — B40: domain-axis registry contract.
 *
 * Each KNOWLEDGE_DOMAINS tag carries class metadata in domains.registry.ts.
 */
import type { KnowledgeDomain } from "./knowledge-atom.contract.js";
import type { KnowledgeDomainClass } from "./knowledge-perspective.contract.js";

export interface KnowledgeDomainEntry {
  readonly domain: KnowledgeDomain;
  readonly domainClass: KnowledgeDomainClass;
  readonly label: string;
}
