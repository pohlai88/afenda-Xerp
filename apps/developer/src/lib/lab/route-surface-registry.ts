export type LabRouteKind =
  | "static-surface"
  | "operator-dashboard"
  | "operator-list"
  | "operator-settings"
  | "module-document";

export interface LabRouteSurfaceRegistryEntry {
  actionSeam: "governed-active" | "placeholder-only";
  cacheSeam: "governed-active" | "placeholder-only";
  heading: string;
  href: string;
  kind: LabRouteKind;
  marker: string;
  navGroupLabel?: string;
  navLabel?: string;
  promotionTarget: "erp-route" | "retire" | "studio-reference";
  querySeam: "governed-active" | "placeholder-only";
  rendering: "auto" | "force-dynamic";
  requiresLoadingBoundary: boolean;
  routeId: string;
  routePath: string;
  runtimeAuthoritySeam: "governed-active" | "placeholder-only";
  showInNav: boolean;
}

export const labRouteSurfaceRegistry = [
  {
    actionSeam: "placeholder-only",
    cacheSeam: "placeholder-only",
    heading: "ERP-parity route composition without ERP runtime authority.",
    href: "/",
    kind: "static-surface",
    marker: "Controlling doctrine",
    promotionTarget: "studio-reference",
    querySeam: "placeholder-only",
    rendering: "auto",
    requiresLoadingBoundary: false,
    routeId: "lab.index",
    routePath: "/",
    runtimeAuthoritySeam: "placeholder-only",
    showInNav: false,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "Sales command surface",
    href: "/dashboard/sales",
    kind: "operator-dashboard",
    marker: "Canonical Route Pattern",
    navGroupLabel: "Dashboards",
    navLabel: "Sales",
    promotionTarget: "erp-route",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "dashboard.sales",
    routePath: "/dashboard/sales",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "Finance readiness view",
    href: "/dashboard/finance",
    kind: "operator-dashboard",
    marker: "Secondary Route Pattern",
    navGroupLabel: "Dashboards",
    navLabel: "Finance",
    promotionTarget: "erp-route",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "dashboard.finance",
    routePath: "/dashboard/finance",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "User directory review surface",
    href: "/admin/users",
    kind: "operator-list",
    marker: "Operator List Surface",
    navGroupLabel: "Operations",
    navLabel: "Users",
    promotionTarget: "erp-route",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "admin.users",
    routePath: "/admin/users",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "governed-active",
    cacheSeam: "governed-active",
    heading: "Appearance settings review",
    href: "/settings/appearance",
    kind: "operator-settings",
    marker: "Theme Surface",
    navGroupLabel: "Operations",
    navLabel: "Appearance",
    promotionTarget: "erp-route",
    querySeam: "governed-active",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "settings.appearance",
    routePath: "/settings/appearance",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "Integration Map — full-stack traceability mirror",
    href: "/architecture",
    kind: "operator-dashboard",
    marker: "Governance Visualization",
    navGroupLabel: "Operations",
    navLabel: "Integration Map",
    promotionTarget: "retire",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "architecture.integration.map",
    routePath: "/architecture",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "Requisition document route",
    href: "/modules/procurement/requisition/REQ-1001",
    kind: "module-document",
    marker: "Module Document Surface",
    navGroupLabel: "Modules",
    navLabel: "Requisition Doc",
    promotionTarget: "erp-route",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "modules.procurement.requisition.document",
    routePath: "/modules/[moduleSlug]/[surface]/[documentId]",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
] satisfies readonly LabRouteSurfaceRegistryEntry[];

export const labSmokableRouteRegistry = labRouteSurfaceRegistry.map(
  ({ heading, href, marker }) => ({
    heading,
    href,
    marker,
  })
);
