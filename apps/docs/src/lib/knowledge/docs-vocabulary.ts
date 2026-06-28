/**
 * PAS-004B B35 / PAS-004C B48 — docs consumer proof for @afenda/enterprise-knowledge.
 *
 * Accepted meaning for configure-tenant vocabulary blocks comes from consumer profiles only.
 */
import {
  projectKnowledgeAtom,
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

function readDocsProjection(atomId: KnowledgeAtomId) {
  return projectKnowledgeAtom(atomId, "docs");
}

function readErpProjection(atomId: KnowledgeAtomId) {
  return projectKnowledgeAtom(atomId, "erp");
}

export function resolveDocsKnowledgeAtomTitle(
  atomId: KnowledgeAtomId
): string {
  const projected = readErpProjection(atomId);
  const shortDescription = projected["shortDescription"];
  if (typeof shortDescription !== "string") {
    return "";
  }
  return shortDescription.replace(/\.$/, "");
}

export function resolveDocsKnowledgeAtomDefinition(
  atomId: KnowledgeAtomId
): string {
  const projected = readDocsProjection(atomId);
  const longExplanation = projected["longExplanation"];
  return typeof longExplanation === "string" ? longExplanation : "";
}

/** Citation string for MDX and governance scans — includes atomId for proof. */
export function formatDocsKnowledgeAtomCitation(atomId: KnowledgeAtomId): string {
  return `${atomId}: ${resolveDocsKnowledgeAtomDefinition(atomId)}`;
}
