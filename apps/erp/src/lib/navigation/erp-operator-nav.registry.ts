import { toProcurementPermissionKey } from "@afenda/kernel/erp-domain/procurement";
import { PERMISSION_REGISTRY } from "@afenda/permissions";

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
  label: "Platform",
  items: [
    {
      href: "/metadata-workspace",
      label: "Metadata Workspace",
      readPermissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
    },
  ],
} as const satisfies ErpOperatorNavGroupDefinition;

export const ERP_PROCUREMENT_NAV_GROUP = {
  label: "Procurement",
  items: [
    {
      href: "/modules/procurement/readiness",
      label: "Foundation Readiness",
    },
    {
      href: "/modules/procurement/requisitions",
      label: "Requisitions",
      readPermissionKey: toProcurementPermissionKey("requisition", "read"),
    },
    {
      href: "/modules/procurement/purchase-orders",
      label: "Purchase Orders",
      readPermissionKey: toProcurementPermissionKey("purchaseOrder", "read"),
    },
  ],
} as const satisfies ErpOperatorNavGroupDefinition;

export const ERP_ACCOUNT_NAV_GROUP = {
  label: "Account",
  items: [
    {
      href: "/settings/profile",
      label: "Profile",
    },
  ],
} as const satisfies ErpOperatorNavGroupDefinition;
