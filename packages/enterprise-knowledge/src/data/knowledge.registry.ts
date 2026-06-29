/**
 * PAS-004A §4.1 — B25: JSON data authority loader.
 * atoms.json is authoritative — edit atoms.json, not inline literals here.
 */
import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import atomsJson from "./atoms.json" with { type: "json" };
import { parseAtomCorpus } from "./knowledge-data.loader.js";

/** B24 MVP prefix — frozen; B29/B31 append after this tuple. */
export const B24_KNOWLEDGE_ATOM_IDS = [
  "legal_entity",
  "organization_unit",
  "workspace",
  "surface",
  "payload",
  "invariant",
  "contract",
  "metadata",
  "double_entry",
  "accounting_equation",
  "organization_split",
  "ifrs_10",
] as const;
export const B29_PLATFORM_ATOM_IDS = [
  "tenant",
  "entity_group",
  "ownership_interest",
  "consolidation_scope",
] as const;
export const B31_CONTEXT_ATOM_IDS = [
  "operating_context",
  "permission_scope",
  "project",
  "team",
  "localization_context",
  "workflow_context",
  "business_reference",
  "human_reference",
] as const;
/** PAS-004D §4.5 B53 — ERP-domain meaning bridge (KV-INV / KV-PROC pairing). */
export const B53_ERP_DOMAIN_BRIDGE_ATOM_IDS = [
  "inventory_item",
  "procurement_requisition",
] as const;
export const KNOWLEDGE_ATOM_IDS = [
  ...B24_KNOWLEDGE_ATOM_IDS,
  ...B29_PLATFORM_ATOM_IDS,
  ...B31_CONTEXT_ATOM_IDS,
  ...B53_ERP_DOMAIN_BRIDGE_ATOM_IDS,
] as const;
export type KnowledgeAtomId = (typeof KNOWLEDGE_ATOM_IDS)[number];

export const ENTERPRISE_KNOWLEDGE_ATOMS: readonly KnowledgeAtom[] =
  parseAtomCorpus(atomsJson);

export const ENTERPRISE_KNOWLEDGE_FINGERPRINT =
  "ENTERPRISE-KNOWLEDGE-2026-06-28-v2" as const;
