/**
 * PAS-004A B27/B32 / PAS-004C B47 — production consumer proof for @afenda/enterprise-knowledge.
 *
 * Resolves accepted enterprise wording via consumer profile projections.
 * Registry is authoritative; this module must not redefine atom meaning locally.
 */
import {
  KNOWLEDGE_ATOM_IDS,
  type KnowledgeAtomId,
  projectKnowledgeAtom,
} from "@afenda/enterprise-knowledge";

import type { SystemAdminSettingsSectionId } from "../system-admin/system-admin-settings.copy.contract";

export const SYSTEM_ADMIN_KNOWLEDGE_ATOM_BY_SECTION = {
  tenant: "tenant",
  "legal-entity": "legal_entity",
  "permission-scope": "permission_scope",
} as const satisfies Record<SystemAdminSettingsSectionId, KnowledgeAtomId>;

export type SystemAdminKnowledgeSectionId = SystemAdminSettingsSectionId;

export function isSystemAdminKnowledgeSectionId(
  value: string
): value is SystemAdminKnowledgeSectionId {
  return value in SYSTEM_ADMIN_KNOWLEDGE_ATOM_BY_SECTION;
}

/**
 * Returns Afenda-preferred wording from the metadata consumer profile,
 * falling back to ERP canonical label when preferred wording is absent.
 */
export function getEnterpriseKnowledgePreferredWording(
  atomId: KnowledgeAtomId
): string {
  const metadata = projectKnowledgeAtom(atomId, "metadata");
  const preferred = metadata.preferredWording;
  if (typeof preferred === "string" && preferred.length > 0) {
    return preferred;
  }
  const erp = projectKnowledgeAtom(atomId, "erp");
  const canonicalLabel = erp.canonicalLabel;
  return typeof canonicalLabel === "string" ? canonicalLabel : "";
}

export function getSystemAdminSectionKnowledgeWording(
  sectionId: SystemAdminKnowledgeSectionId
): string {
  const atomId = SYSTEM_ADMIN_KNOWLEDGE_ATOM_BY_SECTION[sectionId];
  return getEnterpriseKnowledgePreferredWording(atomId);
}

/** Serializable section title derived from ERP profile shortDescription. */
export function getSystemAdminSectionKnowledgeTitle(
  sectionId: SystemAdminKnowledgeSectionId
): string {
  const atomId = SYSTEM_ADMIN_KNOWLEDGE_ATOM_BY_SECTION[sectionId];
  const erp = projectKnowledgeAtom(atomId, "erp");
  const shortDescription = erp.shortDescription;
  if (typeof shortDescription !== "string") {
    return "";
  }
  return shortDescription.replace(/\.$/, "");
}

export function resolveKnowledgeAtomIdFromString(
  value: string
): KnowledgeAtomId | undefined {
  for (const atomId of KNOWLEDGE_ATOM_IDS) {
    if (atomId === value) {
      return atomId;
    }
  }
  return;
}

export function listSystemAdminKnowledgeAtomIds(): readonly KnowledgeAtomId[] {
  return Object.values(SYSTEM_ADMIN_KNOWLEDGE_ATOM_BY_SECTION);
}
