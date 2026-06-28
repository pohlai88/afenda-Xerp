/**
 * PAS-004C §4.3 — B43: KnowledgeConsumerProfile contract.
 *
 * Consumer packages (ERP, metadata, docs, AI, report) must not re-decide which
 * atom facets to expose. Profiles declare the authoritative projection surface.
 *
 * Authority: PAS-004 §9.2 (representations) · PAS-004C §4.3
 */

export const KNOWLEDGE_CONSUMER_PROFILES = [
  "erp",
  "metadata",
  "docs",
  "ai",
  "report",
] as const;

export type KnowledgeConsumerProfile =
  (typeof KNOWLEDGE_CONSUMER_PROFILES)[number];

export function isKnowledgeConsumerProfile(
  value: string
): value is KnowledgeConsumerProfile {
  return (KNOWLEDGE_CONSUMER_PROFILES as readonly string[]).includes(value);
}
