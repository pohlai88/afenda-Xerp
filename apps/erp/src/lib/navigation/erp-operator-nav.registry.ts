import { toProcurementPermissionKey } from "@afenda/kernel/erp-domain/procurement";
import { PERMISSION_REGISTRY } from "@afenda/permissions";

import { OPERATOR_NAV_LABELS } from "./operator-nav-label.registry";

export interface ErpOperatorNavItemDefinition {
  readonly href: string;
  readonly label: string;
  /** When omitted, item is visible to all authenticated protected operators. */
  readonly readPermissionKey?: string;
}

export interface ErpOperatorNavGroupDefinition {
  readonly items: readonly ErpOperatorNavItemDefinition[];
  readonly label: string;
}

export const ERP_PLATFORM_NAV_GROUP = {
  label: OPERATOR_NAV_LABELS.platformGroup.label,
  items: [
    {
      href: "/workspace",
      label: OPERATOR_NAV_LABELS.workspaceHome.label,
      readPermissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
    },
    {
      href: "/metadata-workspace",
      label: OPERATOR_NAV_LABELS.metadataWorkspace.label,
      readPermissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
    },
  ],
} as const satisfies ErpOperatorNavGroupDefinition;

export const ERP_PROCUREMENT_NAV_GROUP = {
  label: OPERATOR_NAV_LABELS.procurementGroup.label,
  items: [
    {
      href: "/modules/procurement/readiness",
      label: OPERATOR_NAV_LABELS.foundationReadiness.label,
    },
    {
      href: "/modules/procurement/requisitions",
      label: OPERATOR_NAV_LABELS.requisitions.label,
      readPermissionKey: toProcurementPermissionKey("requisition", "read"),
    },
    {
      href: "/modules/procurement/purchase-orders",
      label: OPERATOR_NAV_LABELS.purchaseOrders.label,
      readPermissionKey: toProcurementPermissionKey("purchaseOrder", "read"),
    },
  ],
} as const satisfies ErpOperatorNavGroupDefinition;

export const ERP_ACCOUNT_NAV_GROUP = {
  label: OPERATOR_NAV_LABELS.accountGroup.label,
  items: [
    {
      href: "/settings/profile",
      label: OPERATOR_NAV_LABELS.profile.label,
    },
  ],
} as const satisfies ErpOperatorNavGroupDefinition;
