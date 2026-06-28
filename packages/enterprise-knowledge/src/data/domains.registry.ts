/**
 * PAS-004C §4.5 — B40: authoritative domain-axis registry.
 *
 * Classifies each KNOWLEDGE_DOMAINS tag as business, architecture, or knowledge.
 * Enum values are frozen — metadata only; no renames.
 */
import type { KnowledgeDomain } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeDomainEntry } from "../contracts/knowledge-domain-registry.contract.js";

export const KNOWLEDGE_DOMAIN_ENTRIES = [
  // ── Business domains ──────────────────────────────────────────────────────
  {
    domain: "accounting",
    domainClass: "business",
    label: "Accounting",
  },
  {
    domain: "taxation",
    domainClass: "business",
    label: "Taxation",
  },
  {
    domain: "manufacturing",
    domainClass: "business",
    label: "Manufacturing",
  },
  {
    domain: "inventory",
    domainClass: "business",
    label: "Inventory",
  },
  {
    domain: "hr",
    domainClass: "business",
    label: "Human Resources",
  },
  {
    domain: "finance",
    domainClass: "business",
    label: "Finance",
  },
  {
    domain: "reporting",
    domainClass: "business",
    label: "Reporting",
  },
  {
    domain: "consolidation",
    domainClass: "business",
    label: "Consolidation",
  },
  // ── Architecture domains ────────────────────────────────────────────────────
  {
    domain: "platform",
    domainClass: "architecture",
    label: "Platform",
  },
  {
    domain: "architecture",
    domainClass: "architecture",
    label: "Architecture",
  },
  {
    domain: "engineering",
    domainClass: "architecture",
    label: "Engineering",
  },
  {
    domain: "api",
    domainClass: "architecture",
    label: "API",
  },
  {
    domain: "networking",
    domainClass: "architecture",
    label: "Networking",
  },
  {
    domain: "integration",
    domainClass: "architecture",
    label: "Integration",
  },
  {
    domain: "ai",
    domainClass: "architecture",
    label: "Artificial Intelligence",
  },
  {
    domain: "security",
    domainClass: "architecture",
    label: "Security",
  },
  {
    domain: "identity",
    domainClass: "architecture",
    label: "Identity",
  },
] as const satisfies readonly KnowledgeDomainEntry[];

const domainEntryByDomain = new Map<KnowledgeDomain, KnowledgeDomainEntry>(
  KNOWLEDGE_DOMAIN_ENTRIES.map((entry) => [entry.domain, entry] as const)
);

export function getKnowledgeDomainEntry(
  domain: KnowledgeDomain
): KnowledgeDomainEntry {
  const entry = domainEntryByDomain.get(domain);
  if (!entry) {
    throw new Error(`Unknown knowledge domain: ${domain}`);
  }
  return entry;
}

export function getKnowledgeDomainClass(
  domain: KnowledgeDomain
): KnowledgeDomainEntry["domainClass"] {
  return getKnowledgeDomainEntry(domain).domainClass;
}
