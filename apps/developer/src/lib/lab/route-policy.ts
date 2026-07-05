export type LabRouteKind =
  | "static-surface"
  | "operator-dashboard"
  | "operator-list"
  | "operator-settings";

export interface LabRoutePolicy {
  href: string;
  kind: LabRouteKind;
  promotionTarget: "erp-route" | "retire" | "studio-reference";
  rendering: "auto" | "force-dynamic";
  requiresLoadingBoundary: boolean;
  routeId: string;
}

export const labRoutePolicies = [
  {
    routeId: "lab.index",
    href: "/",
    kind: "static-surface",
    rendering: "auto",
    promotionTarget: "studio-reference",
    requiresLoadingBoundary: false,
  },
  {
    routeId: "dashboard.sales",
    href: "/dashboard/sales",
    kind: "operator-dashboard",
    rendering: "force-dynamic",
    promotionTarget: "erp-route",
    requiresLoadingBoundary: true,
  },
  {
    routeId: "dashboard.finance",
    href: "/dashboard/finance",
    kind: "operator-dashboard",
    rendering: "force-dynamic",
    promotionTarget: "erp-route",
    requiresLoadingBoundary: true,
  },
  {
    routeId: "admin.users",
    href: "/admin/users",
    kind: "operator-list",
    rendering: "force-dynamic",
    promotionTarget: "erp-route",
    requiresLoadingBoundary: true,
  },
  {
    routeId: "settings.appearance",
    href: "/settings/appearance",
    kind: "operator-settings",
    rendering: "force-dynamic",
    promotionTarget: "erp-route",
    requiresLoadingBoundary: true,
  },
] satisfies readonly LabRoutePolicy[];
