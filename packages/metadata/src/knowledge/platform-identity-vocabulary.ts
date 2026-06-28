/**
 * PAS-004B B34 — metadata consumer proof for @afenda/enterprise-knowledge.
 *
 * Accepted platform identity labels come from Knowledge Atoms only.
 * Metadata must not fork canonical meaning locally.
 */
import {
  getKnowledgeAtom,
  type KnowledgeAtomId,
} from "@afenda/enterprise-knowledge";

/** Platform identity atoms cited by metadata section/surface vocabulary. */
export const PLATFORM_IDENTITY_KNOWLEDGE_ATOM_IDS = [
  "tenant",
  "legal_entity",
  "organization_unit",
  "workspace",
  "surface",
] as const satisfies readonly KnowledgeAtomId[];

export type PlatformIdentityKnowledgeAtomId =
  (typeof PLATFORM_IDENTITY_KNOWLEDGE_ATOM_IDS)[number];

export function isPlatformIdentityKnowledgeAtomId(
  value: string
): value is PlatformIdentityKnowledgeAtomId {
  return (PLATFORM_IDENTITY_KNOWLEDGE_ATOM_IDS as readonly string[]).includes(
    value
  );
}

/** Afenda-preferred wording from the authoritative atom registry. */
export function resolvePlatformIdentityKnowledgeLabel(
  atomId: PlatformIdentityKnowledgeAtomId
): string {
  const atom = getKnowledgeAtom(atomId);
  if (atom.exposure.afendaPreferredWording.length > 0) {
    return atom.exposure.afendaPreferredWording;
  }
  return atom.meaning.canonical;
}

/** Canonical accepted definition for metadata contract documentation. */
export function resolvePlatformIdentityKnowledgeCanonicalDefinition(
  atomId: PlatformIdentityKnowledgeAtomId
): string {
  return getKnowledgeAtom(atomId).meaning.canonical;
}

/** Business-facing title derived from accepted atom meaning. */
export function resolvePlatformIdentityKnowledgeBusinessTitle(
  atomId: PlatformIdentityKnowledgeAtomId
): string {
  return getKnowledgeAtom(atomId).meaning.business.replace(/\.$/, "");
}
