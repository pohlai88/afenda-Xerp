/**
 * PAS-004C §4.5 — B40: domain-axis query and validation policy.
 */
import { KNOWLEDGE_DOMAINS } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeDomainEntry } from "../contracts/knowledge-domain-registry.contract.js";
import type { KnowledgeDomainClass } from "../contracts/knowledge-perspective.contract.js";
import {
  getKnowledgeDomainEntry,
  KNOWLEDGE_DOMAIN_ENTRIES,
} from "../data/domains.registry.js";

/** Required architecture-class domains (B40 DoD). */
export const ARCHITECTURE_KNOWLEDGE_DOMAINS = [
  "platform",
  "architecture",
  "engineering",
  "api",
] as const;

/** Required business-class domains (B40 DoD). */
export const BUSINESS_KNOWLEDGE_DOMAINS = [
  "accounting",
  "hr",
  "finance",
] as const;

export function filterByDomainClass(
  domainClass: KnowledgeDomainClass
): readonly KnowledgeDomainEntry[] {
  return KNOWLEDGE_DOMAIN_ENTRIES.filter(
    (entry) => entry.domainClass === domainClass
  );
}

export function getKnowledgeDomainsByClass(
  domainClass: KnowledgeDomainClass
): readonly KnowledgeDomainEntry["domain"][] {
  return filterByDomainClass(domainClass).map((entry) => entry.domain);
}

export function validateKnowledgeDomainAxis(): readonly string[] {
  const errors: string[] = [];

  if (KNOWLEDGE_DOMAIN_ENTRIES.length !== KNOWLEDGE_DOMAINS.length) {
    errors.push(
      `domains.registry.ts: expected ${KNOWLEDGE_DOMAINS.length} entries, found ${KNOWLEDGE_DOMAIN_ENTRIES.length}`
    );
  }

  for (const domain of KNOWLEDGE_DOMAINS) {
    const entry = KNOWLEDGE_DOMAIN_ENTRIES.find((e) => e.domain === domain);
    if (!entry) {
      errors.push(`domains.registry.ts: missing domainClass for "${domain}"`);
      continue;
    }
    if (!entry.label.trim()) {
      errors.push(`domains.registry.ts: domain "${domain}" has empty label`);
    }
  }

  for (const entry of KNOWLEDGE_DOMAIN_ENTRIES) {
    if (!KNOWLEDGE_DOMAINS.includes(entry.domain)) {
      errors.push(
        `domains.registry.ts: unknown domain "${entry.domain}" — not in KNOWLEDGE_DOMAINS`
      );
    }
  }

  for (const domain of ARCHITECTURE_KNOWLEDGE_DOMAINS) {
    const entry = getKnowledgeDomainEntry(domain);
    if (entry.domainClass !== "architecture") {
      errors.push(
        `domains.registry.ts: "${domain}" must be architecture, got "${entry.domainClass}"`
      );
    }
  }

  for (const domain of BUSINESS_KNOWLEDGE_DOMAINS) {
    const entry = getKnowledgeDomainEntry(domain);
    if (entry.domainClass !== "business") {
      errors.push(
        `domains.registry.ts: "${domain}" must be business, got "${entry.domainClass}"`
      );
    }
  }

  return errors;
}
