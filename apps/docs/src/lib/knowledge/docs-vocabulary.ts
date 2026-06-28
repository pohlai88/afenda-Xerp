/**
 * PAS-004B B35 — docs consumer proof for @afenda/enterprise-knowledge.
 *
 * Accepted meaning for configure-tenant vocabulary blocks comes from atoms only.
 */
import {
  getKnowledgeAtom,
  type KnowledgeAtomId,
} from "@afenda/enterprise-knowledge";

/** Platform identity atoms cited by configure-tenant docs vocabulary blocks. */
export const DOCS_PLATFORM_IDENTITY_ATOM_IDS = [
  "tenant",
  "legal_entity",
  "organization_unit",
  "workspace",
] as const satisfies readonly KnowledgeAtomId[];

export type DocsPlatformIdentityAtomId =
  (typeof DOCS_PLATFORM_IDENTITY_ATOM_IDS)[number];

export function isDocsPlatformIdentityAtomId(
  value: string
): value is DocsPlatformIdentityAtomId {
  return (DOCS_PLATFORM_IDENTITY_ATOM_IDS as readonly string[]).includes(value);
}

export function resolveDocsKnowledgeAtomTitle(
  atomId: KnowledgeAtomId
): string {
  return getKnowledgeAtom(atomId).meaning.business.replace(/\.$/, "");
}

export function resolveDocsKnowledgeAtomDefinition(
  atomId: KnowledgeAtomId
): string {
  return getKnowledgeAtom(atomId).meaning.canonical;
}

/** Citation string for MDX and governance scans — includes atomId for proof. */
export function formatDocsKnowledgeAtomCitation(atomId: KnowledgeAtomId): string {
  return `${atomId}: ${resolveDocsKnowledgeAtomDefinition(atomId)}`;
}
