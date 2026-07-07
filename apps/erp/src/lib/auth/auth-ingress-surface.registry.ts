/**
 * PAS-006 — canonical public auth ingress surfaces (metadata-driven UI).
 * Derived from auth-route-catalog SSOT.
 */

import type { AuthShellVariant } from "./auth-path.registry";
import {
  AUTH_ROUTE_CATALOG,
  type AuthRouteCatalogPath,
} from "./auth-route-catalog";

export type AuthIngressSurfaceEntry = {
  readonly blockId: AuthShellVariant;
  readonly path: string;
  readonly surfaceTemplateId: string;
};

/** Protected operator metadata preview — not a second sign-in ingress. */
export const AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT = {
  destination: "/metadata-workspace",
  source: "/operator/auth/sign-in",
} as const;

export const AUTH_INGRESS_CANONICAL_SURFACES = AUTH_ROUTE_CATALOG.map(
  (entry) => ({
    blockId: entry.blockId,
    path: entry.path,
    surfaceTemplateId: entry.surfaceTemplateId,
  })
) as readonly AuthIngressSurfaceEntry[];

export type AuthIngressCanonicalPath = AuthRouteCatalogPath;

export const AUTH_INGRESS_PUBLIC_PATH_PREFIXES =
  AUTH_INGRESS_CANONICAL_SURFACES.map(
    (surface) => surface.path
  ) as AuthIngressCanonicalPath[];

export function isAuthIngressCanonicalPath(
  pathname: string
): pathname is AuthIngressCanonicalPath {
  return AUTH_INGRESS_PUBLIC_PATH_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function getAuthIngressSurfaceByPath(
  pathname: string
): AuthIngressSurfaceEntry | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return AUTH_INGRESS_CANONICAL_SURFACES.find(
    (surface) => surface.path === normalized
  );
}
