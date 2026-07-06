import {
  type LabRouteKind,
  labRouteSurfaceRegistry,
} from "./route-surface-registry";

export interface LabRoutePolicy {
  actionSeam: "governed-active" | "placeholder-only";
  cacheSeam: "governed-active" | "placeholder-only";
  href: string;
  kind: LabRouteKind;
  promotionTarget: "erp-route" | "retire" | "studio-reference";
  querySeam: "governed-active" | "placeholder-only";
  rendering: "auto" | "force-dynamic";
  requiresLoadingBoundary: boolean;
  routeId: string;
  routePath: string;
  runtimeAuthoritySeam: "governed-active" | "placeholder-only";
}

export const labRoutePolicies = labRouteSurfaceRegistry.map(
  ({
    actionSeam,
    cacheSeam,
    href,
    kind,
    promotionTarget,
    querySeam,
    rendering,
    requiresLoadingBoundary,
    routeId,
    routePath,
    runtimeAuthoritySeam,
  }) => ({
    actionSeam,
    cacheSeam,
    href,
    kind,
    promotionTarget,
    querySeam,
    rendering,
    requiresLoadingBoundary,
    routeId,
    routePath,
    runtimeAuthoritySeam,
  })
) satisfies readonly LabRoutePolicy[];
