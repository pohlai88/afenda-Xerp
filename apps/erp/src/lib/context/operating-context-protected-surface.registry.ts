/**
 * PAS-001A R1b — protected RSC/API surfaces with IS-002 spine delegates (INV-001).
 *
 * Every `(protected)/**` page and protected API ingress MUST declare a spine delegate.
 */

export type OperatingContextProtectedSurfaceKind =
  | "protected-rsc"
  | "protected-api"
  | "protected-server-action";

export interface OperatingContextProtectedSurfaceEntry {
  readonly delegate:
    | "resolveOperatingContext"
    | "loadProtectedRequestOperatingContext"
    | "resolveOperatingContextFromHeaders"
    | "resolveApiRouteOperatingContext"
    | "resolveActionOperatingContext"
    | "loadMetadataOperatorSurfacePage"
    | "loadProcurementFoundationReadinessPage"
    | "loadProcurementPurchaseOrdersPage"
    | "loadProcurementRequisitionsPage"
    | "loadSystemAdminSectionPage";
  readonly id: string;
  readonly kind: OperatingContextProtectedSurfaceKind;
  readonly module: string;
  readonly routePattern: string;
}

export const OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY = [
  {
    id: "protected-rsc-layout",
    kind: "protected-rsc",
    module: "app/(protected)/layout.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/(protected)/*",
  },
  {
    id: "protected-rsc-metadata-workspace",
    kind: "protected-rsc",
    module: "app/(protected)/metadata-workspace/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/metadata-workspace",
  },
  {
    id: "protected-rsc-settings-profile",
    kind: "protected-rsc",
    module: "app/(protected)/settings/profile/page.tsx",
    delegate: "loadMetadataOperatorSurfacePage",
    routePattern: "/settings/profile",
  },
  {
    id: "protected-rsc-procurement-foundation-readiness",
    kind: "protected-rsc",
    module: "app/(protected)/modules/procurement/readiness/page.tsx",
    delegate: "loadProcurementFoundationReadinessPage",
    routePattern: "/modules/procurement/readiness",
  },
  {
    id: "protected-rsc-procurement-requisitions-list",
    kind: "protected-rsc",
    module: "app/(protected)/modules/procurement/requisitions/page.tsx",
    delegate: "loadProcurementRequisitionsPage",
    routePattern: "/modules/procurement/requisitions",
  },
  {
    id: "protected-rsc-procurement-purchase-orders-list",
    kind: "protected-rsc",
    module: "app/(protected)/modules/procurement/purchase-orders/page.tsx",
    delegate: "loadProcurementPurchaseOrdersPage",
    routePattern: "/modules/procurement/purchase-orders",
  },
  {
    id: "protected-rsc-system-admin-users",
    kind: "protected-rsc",
    module: "app/(protected)/system-admin/users/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/system-admin/users",
  },
  {
    id: "protected-rsc-system-admin-memberships",
    kind: "protected-rsc",
    module: "app/(protected)/system-admin/memberships/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/system-admin/memberships",
  },
  {
    id: "protected-rsc-system-admin-roles",
    kind: "protected-rsc",
    module: "app/(protected)/system-admin/roles/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/system-admin/roles",
  },
  {
    id: "protected-rsc-system-admin-permissions",
    kind: "protected-rsc",
    module: "app/(protected)/system-admin/permissions/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/system-admin/permissions",
  },
  {
    id: "protected-rsc-system-admin-audit",
    kind: "protected-rsc",
    module: "app/(protected)/system-admin/audit/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/system-admin/audit",
  },
  {
    id: "protected-rsc-system-admin-settings",
    kind: "protected-rsc",
    module: "app/(protected)/system-admin/settings/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/system-admin/settings",
  },
  {
    id: "protected-rsc-system-admin-diagnostics",
    kind: "protected-rsc",
    module: "app/(protected)/system-admin/diagnostics/page.tsx",
    delegate: "loadProtectedRequestOperatingContext",
    routePattern: "/system-admin/diagnostics",
  },
  {
    id: "protected-api-operating-context",
    kind: "protected-api",
    module: "lib/api/resolve-api-route-operating-context.ts",
    delegate: "resolveApiRouteOperatingContext",
    routePattern: "/api/internal/v1/*",
  },
  {
    id: "protected-server-action-operating-context",
    kind: "protected-server-action",
    module: "lib/server-actions/resolve-action-operating-context.server.ts",
    delegate: "resolveActionOperatingContext",
    routePattern: "server-action",
  },
  {
    id: "protected-server-action-context-switch",
    kind: "protected-server-action",
    module: "lib/context/context-switch.action.ts",
    delegate: "resolveActionOperatingContext",
    routePattern: "server-action/context-switch",
  },
] as const satisfies readonly OperatingContextProtectedSurfaceEntry[];

export type OperatingContextProtectedSurfaceId =
  (typeof OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY)[number]["id"];
