import type { KnowledgeAtomId } from "@afenda/enterprise-knowledge";

/**
 * PAS-004E — operator nav label registry.
 * Registered labels in terms.json; optional labelAtomId links module/knowledge maps.
 */
export interface OperatorNavLabelDefinition {
  readonly label: string;
  readonly labelAtomId?: KnowledgeAtomId;
}

export const OPERATOR_NAV_LABELS = {
  metadataWorkspace: {
    label: "Metadata Workspace",
    labelAtomId: "metadata_surface_binding",
  },
  foundationReadiness: {
    label: "Foundation Readiness",
    labelAtomId: "foundation_lifecycle_phase",
  },
  requisitions: {
    label: "Requisitions",
    labelAtomId: "procurement_requisition",
  },
  purchaseOrders: {
    label: "Purchase Orders",
    labelAtomId: "purchase_order",
  },
  platformGroup: {
    label: "Platform",
    labelAtomId: "module_ingress",
  },
  procurementGroup: {
    label: "Procurement",
    labelAtomId: "procurement_requisition",
  },
  accountGroup: {
    label: "Account",
    labelAtomId: "operating_context",
  },
  profile: {
    label: "Profile",
    labelAtomId: "human_reference",
  },
  systemAdminGroup: {
    label: "System Admin",
  },
} as const satisfies Readonly<Record<string, OperatorNavLabelDefinition>>;

export const SYSTEM_ADMIN_NAV_LABELS = {
  users: {
    label: "Users",
    labelAtomId: "human_reference",
  },
  memberships: {
    label: "Memberships",
    labelAtomId: "organization_unit",
  },
  roles: {
    label: "Roles",
    labelAtomId: "permission_binding",
  },
  permissions: {
    label: "Permissions",
    labelAtomId: "permission_scope",
  },
  audit: {
    label: "Audit",
    labelAtomId: "audit_action_map",
  },
  settings: {
    label: "Settings",
    labelAtomId: "module_policy_declaration",
  },
  diagnostics: {
    label: "Diagnostics",
    labelAtomId: "readiness_report",
  },
} as const satisfies Readonly<Record<string, OperatorNavLabelDefinition>>;

/** Flat registry for PAS-004E allowlist linkage tests. */
export const ALL_OPERATOR_NAV_LABEL_DEFINITIONS = [
  ...Object.values(OPERATOR_NAV_LABELS),
  ...Object.values(SYSTEM_ADMIN_NAV_LABELS),
] as const satisfies readonly OperatorNavLabelDefinition[];
