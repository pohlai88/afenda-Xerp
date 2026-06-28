/**
 * PAS-004B B34 / PAS-004C B47 — metadata consumer proof for @afenda/enterprise-knowledge.
 *
 * Accepted platform identity labels come from Knowledge Atoms via consumer profiles only.
 * Metadata must not fork canonical meaning locally.
 */
import {
  type KnowledgeAtomId,
  projectKnowledgeAtom,
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

function readMetadataProjection(atomId: KnowledgeAtomId) {
  return projectKnowledgeAtom(atomId, "metadata");
}

function readDocsProjection(atomId: KnowledgeAtomId) {
  return projectKnowledgeAtom(atomId, "docs");
}

/** Afenda-preferred wording from the metadata consumer profile. */
export function resolvePlatformIdentityKnowledgeLabel(
  atomId: PlatformIdentityKnowledgeAtomId
): string {
  const projected = readMetadataProjection(atomId);
  const preferred = projected["preferredWording"];
  if (typeof preferred === "string" && preferred.length > 0) {
    return preferred;
  }
  const shortLabel = projected["shortLabel"];
  return typeof shortLabel === "string" ? shortLabel : "";
}

/** Canonical accepted definition via docs consumer profile. */
export function resolvePlatformIdentityKnowledgeCanonicalDefinition(
  atomId: PlatformIdentityKnowledgeAtomId
): string {
  const projected = readDocsProjection(atomId);
  const longExplanation = projected["longExplanation"];
  return typeof longExplanation === "string" ? longExplanation : "";
}

/** Business-facing title from metadata short label. */
export function resolvePlatformIdentityKnowledgeBusinessTitle(
  atomId: PlatformIdentityKnowledgeAtomId
): string {
  const projected = readMetadataProjection(atomId);
  const shortLabel = projected["shortLabel"];
  if (typeof shortLabel !== "string") {
    return "";
  }
  return shortLabel.replace(/\.$/, "");
}
