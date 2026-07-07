import {
  type DeveloperRouteImportLaw,
  type DeveloperRouteProfile,
  type LabRouteKind,
  labRouteSurfaceRegistry,
} from "./route-surface-registry";

export interface LabRoutePolicy {
  actionSeam: "governed-active" | "placeholder-only";
  cacheSeam: "governed-active" | "placeholder-only";
  href: string;
  importLaw: DeveloperRouteImportLaw;
  kind: LabRouteKind;
  promotionTarget: "erp-route" | "retire" | "studio-reference";
  querySeam: "governed-active" | "placeholder-only";
  rendering: "auto" | "force-dynamic";
  requiresLoadingBoundary: boolean;
  routeId: string;
  routePath: string;
  routeProfile: DeveloperRouteProfile;
  runtimeAuthoritySeam: "governed-active" | "placeholder-only";
}

export const labRoutePolicies = labRouteSurfaceRegistry.map(
  ({
    actionSeam,
    cacheSeam,
    href,
    importLaw,
    kind,
    promotionTarget,
    querySeam,
    rendering,
    requiresLoadingBoundary,
    routeId,
    routePath,
    routeProfile,
    runtimeAuthoritySeam,
  }) => ({
    actionSeam,
    cacheSeam,
    href,
    importLaw,
    kind,
    promotionTarget,
    querySeam,
    rendering,
    requiresLoadingBoundary,
    routeId,
    routePath,
    routeProfile,
    runtimeAuthoritySeam,
  })
) satisfies readonly LabRoutePolicy[];

export function isOperatorLabRoute(
  policy: Pick<LabRoutePolicy, "routeProfile">
): boolean {
  return policy.routeProfile === "operator-lab";
}

export function isConsumerProofRoute(
  policy: Pick<LabRoutePolicy, "routeProfile">
): boolean {
  return policy.routeProfile === "consumer-proof";
}
