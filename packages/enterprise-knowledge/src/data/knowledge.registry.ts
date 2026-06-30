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
/** PAS-004 EK-MOD-FDN-001/002/003 — module runtime foundation vocabulary (P0). */
export const B54_MODULE_FOUNDATION_ATOM_IDS = [
  "module_runtime_identity",
  "wire_catalog_key",
  "module_ownership_contract",
  "knowledge_map_status",
  "operating_context_consumption",
  "permission_binding",
  "audit_action_map",
  "metadata_surface_binding",
  "module_readiness_dimension",
  "foundation_lifecycle_phase",
  "module_ingress",
  "readiness_report",
] as const;
/** PAS-004 EK-MOD-FDN-004 — module delivery vocabulary (P1). */
export const B55_MODULE_FOUNDATION_P1_ATOM_IDS = [
  "module_policy_declaration",
  "module_event_catalog",
  "outbox_requirement_classification",
] as const;
/** PAS-004 KV-PROC P0 — procurement business meaning bridge. */
export const B56_PROCUREMENT_P0_ATOM_IDS = [
  "purchase_order",
  "supplier",
  "procurement_rfq",
] as const;
/** PAS-004 KV-PROC P1 — sourcing, blanket, supplier quote meaning bridge. */
export const B57_PROCUREMENT_P1_ATOM_IDS = [
  "procurement_sourcing",
  "blanket_agreement",
  "supplier_quote",
] as const;
export const KNOWLEDGE_ATOM_IDS = [
  ...B24_KNOWLEDGE_ATOM_IDS,
  ...B29_PLATFORM_ATOM_IDS,
  ...B31_CONTEXT_ATOM_IDS,
  ...B53_ERP_DOMAIN_BRIDGE_ATOM_IDS,
  ...B54_MODULE_FOUNDATION_ATOM_IDS,
  ...B55_MODULE_FOUNDATION_P1_ATOM_IDS,
  ...B56_PROCUREMENT_P0_ATOM_IDS,
  ...B57_PROCUREMENT_P1_ATOM_IDS,
] as const;
export type KnowledgeAtomId = (typeof KNOWLEDGE_ATOM_IDS)[number];

export const ENTERPRISE_KNOWLEDGE_ATOMS: readonly KnowledgeAtom[] =
  parseAtomCorpus(atomsJson);

export const ENTERPRISE_KNOWLEDGE_FINGERPRINT =
  "ENTERPRISE-KNOWLEDGE-2026-06-30-v4" as const;
