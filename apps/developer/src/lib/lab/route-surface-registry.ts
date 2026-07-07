export type DeveloperRouteProfile = "index" | "operator-lab" | "consumer-proof";

export type DeveloperRouteImportLaw =
  | "lab-runtime-ceiling"
  | "public-v2-exports-only";

export type DeveloperRouteProofKind = "route-lab" | "package-consumer";

export type LabRouteKind =
  | "static-surface"
  | "operator-dashboard"
  | "operator-list"
  | "operator-settings"
  | "module-document"
  | "consumer-proof";

export interface LabRouteSurfaceRegistryEntry {
  actionSeam: "governed-active" | "placeholder-only";
  cacheSeam: "governed-active" | "placeholder-only";
  heading: string;
  href: string;
  importLaw: DeveloperRouteImportLaw;
  kind: LabRouteKind;
  marker: string;
  navGroupLabel?: string;
  navLabel?: string;
  promotionTarget: "erp-route" | "retire" | "studio-reference";
  proofKind?: DeveloperRouteProofKind;
  querySeam: "governed-active" | "placeholder-only";
  rendering: "auto" | "force-dynamic";
  requiresLoadingBoundary: boolean;
  routeId: string;
  routePath: string;
  routeProfile: DeveloperRouteProfile;
  runtimeAuthoritySeam: "governed-active" | "placeholder-only";
  showInNav: boolean;
}

export const labRouteSurfaceRegistry = [
  {
    actionSeam: "placeholder-only",
    cacheSeam: "placeholder-only",
    heading: "ERP-parity route composition without ERP runtime authority.",
    href: "/",
    importLaw: "lab-runtime-ceiling",
    kind: "static-surface",
    marker: "Controlling doctrine",
    promotionTarget: "studio-reference",
    proofKind: "route-lab",
    querySeam: "placeholder-only",
    rendering: "auto",
    requiresLoadingBoundary: false,
    routeId: "lab.index",
    routePath: "/",
    routeProfile: "index",
    runtimeAuthoritySeam: "placeholder-only",
    showInNav: false,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "Sales command surface",
    href: "/dashboard/sales",
    importLaw: "lab-runtime-ceiling",
    kind: "operator-dashboard",
    marker: "Canonical Route Pattern",
    navGroupLabel: "Dashboards",
    navLabel: "Sales",
    promotionTarget: "erp-route",
    proofKind: "route-lab",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "dashboard.sales",
    routePath: "/dashboard/sales",
    routeProfile: "operator-lab",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "Finance readiness view",
    href: "/dashboard/finance",
    importLaw: "lab-runtime-ceiling",
    kind: "operator-dashboard",
    marker: "Secondary Route Pattern",
    navGroupLabel: "Dashboards",
    navLabel: "Finance",
    promotionTarget: "erp-route",
    proofKind: "route-lab",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "dashboard.finance",
    routePath: "/dashboard/finance",
    routeProfile: "operator-lab",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "User directory review surface",
    href: "/admin/users",
    importLaw: "lab-runtime-ceiling",
    kind: "operator-list",
    marker: "Operator List Surface",
    navGroupLabel: "Operations",
    navLabel: "Users",
    promotionTarget: "erp-route",
    proofKind: "route-lab",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "admin.users",
    routePath: "/admin/users",
    routeProfile: "operator-lab",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "governed-active",
    cacheSeam: "governed-active",
    heading: "Appearance settings review",
    href: "/settings/appearance",
    importLaw: "lab-runtime-ceiling",
    kind: "operator-settings",
    marker: "Theme Surface",
    navGroupLabel: "Operations",
    navLabel: "Appearance",
    promotionTarget: "erp-route",
    proofKind: "route-lab",
    querySeam: "governed-active",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "settings.appearance",
    routePath: "/settings/appearance",
    routeProfile: "operator-lab",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "Integration Map — full-stack traceability mirror",
    href: "/architecture",
    importLaw: "lab-runtime-ceiling",
    kind: "operator-dashboard",
    marker: "Governance Visualization",
    navGroupLabel: "Operations",
    navLabel: "Integration Map",
    promotionTarget: "retire",
    proofKind: "route-lab",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "architecture.integration.map",
    routePath: "/architecture",
    routeProfile: "operator-lab",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "governed-active",
    heading: "Requisition document route",
    href: "/modules/procurement/requisition/REQ-1001",
    importLaw: "lab-runtime-ceiling",
    kind: "module-document",
    marker: "Module Document Surface",
    navGroupLabel: "Modules",
    navLabel: "Requisition Doc",
    promotionTarget: "erp-route",
    proofKind: "route-lab",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: true,
    routeId: "modules.procurement.requisition.document",
    routePath: "/modules/[moduleSlug]/[surface]/[documentId]",
    routeProfile: "operator-lab",
    runtimeAuthoritySeam: "governed-active",
    showInNav: true,
  },
  {
    actionSeam: "placeholder-only",
    cacheSeam: "placeholder-only",
    heading: "V2 design system consumer proof",
    href: "/design-system/v2-proof",
    importLaw: "public-v2-exports-only",
    kind: "consumer-proof",
    marker: "Phase 8 V2 consumer proof",
    promotionTarget: "studio-reference",
    proofKind: "package-consumer",
    querySeam: "placeholder-only",
    rendering: "force-dynamic",
    requiresLoadingBoundary: false,
    routeId: "design.system.v2proof",
    routePath: "/design-system/v2-proof",
    routeProfile: "consumer-proof",
    runtimeAuthoritySeam: "placeholder-only",
    showInNav: false,
  },
] satisfies readonly LabRouteSurfaceRegistryEntry[];

export const developerSmokableRouteRegistry = labRouteSurfaceRegistry.map(
  ({ heading, href, marker, routeProfile }) => ({
    heading,
    href,
    marker,
    routeProfile,
  })
);

/** @deprecated Use developerSmokableRouteRegistry */
export const labSmokableRouteRegistry = developerSmokableRouteRegistry;
