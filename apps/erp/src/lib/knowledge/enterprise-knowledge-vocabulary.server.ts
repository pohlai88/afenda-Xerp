/**
 * PAS-004A B27/B32 — production consumer proof for @afenda/enterprise-knowledge.
 *
 * Resolves accepted enterprise wording from Knowledge Atoms for ERP copy surfaces.
 * Registry is authoritative; this module must not redefine atom meaning locally.
 */
import {
  getKnowledgeAtom,
  KNOWLEDGE_ATOM_IDS,
  type KnowledgeAtomId,
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
 * Returns Afenda-preferred wording from the authoritative atom registry.
 * Falls back to canonical meaning when preferred wording is absent.
 */
export function getEnterpriseKnowledgePreferredWording(
  atomId: KnowledgeAtomId
): string {
  const atom = getKnowledgeAtom(atomId);
  const preferred = atom.exposure.afendaPreferredWording;
  if (preferred.length > 0) {
    return preferred;
  }
  return atom.meaning.canonical;
}

export function getSystemAdminSectionKnowledgeWording(
  sectionId: SystemAdminKnowledgeSectionId
): string {
  const atomId = SYSTEM_ADMIN_KNOWLEDGE_ATOM_BY_SECTION[sectionId];
  return getEnterpriseKnowledgePreferredWording(atomId);
}

/** Serializable section title derived from accepted atom business meaning. */
export function getSystemAdminSectionKnowledgeTitle(
  sectionId: SystemAdminKnowledgeSectionId
): string {
  const atomId = SYSTEM_ADMIN_KNOWLEDGE_ATOM_BY_SECTION[sectionId];
  const atom = getKnowledgeAtom(atomId);
  return atom.meaning.business.replace(/\.$/, "");
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
