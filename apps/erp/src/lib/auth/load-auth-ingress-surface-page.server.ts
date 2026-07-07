import { createMetadataRuntimeContext } from "@/lib/metadata/metadata-runtime.contract";
import type { MetadataOperatorSurfaceWire } from "@/lib/metadata/resolve-metadata-operator-surface.server";
import { resolveMetadataOperatorSurface } from "@/lib/metadata/resolve-metadata-operator-surface.server";

import {
  type AuthIngressCanonicalPath,
  getAuthIngressSurfaceByPath,
} from "./auth-ingress-surface.registry";
import type { AuthLane } from "./auth-path.registry";
import {
  AUTH_PATH_LANE_MAP,
  resolveAuthShellBlockIdForPath,
} from "./auth-path.registry";
import {
  getAuthRouteCatalogEntryByPath,
  resolveAuthRouteDescription,
  resolveAuthRouteTitle,
} from "./auth-route-catalog";

export type AuthIngressSurfacePageData =
  | {
      readonly kind: "error";
      readonly message: string;
      readonly title: string;
    }
  | {
      readonly authShellBlockId: string;
      readonly description: string;
      readonly kind: "ready";
      readonly lane: AuthLane;
      readonly path: AuthIngressCanonicalPath;
      readonly surface: MetadataOperatorSurfaceWire;
      readonly title: string;
    };

/** Public auth ingress — anonymous metadata runtime (no protected operating context). */
export function loadAuthIngressSurfacePage(
  path: AuthIngressCanonicalPath
): AuthIngressSurfacePageData {
  const ingress = getAuthIngressSurfaceByPath(path);

  if (ingress === undefined) {
    return {
      kind: "error",
      title: "Auth ingress unavailable",
      message: `No auth ingress surface registered for path: ${path}`,
    };
  }

  const runtime = createMetadataRuntimeContext();
  const surface = resolveMetadataOperatorSurface({
    runtime,
    surfaceTemplateId: ingress.surfaceTemplateId,
  });

  if (surface === undefined) {
    return {
      kind: "error",
      title: resolveAuthIngressTitle(path),
      message: "The auth ingress surface template is not registered.",
    };
  }

  return {
    authShellBlockId: resolveAuthShellBlockIdForPath(path),
    kind: "ready",
    lane: AUTH_PATH_LANE_MAP[path],
    path,
    title: resolveAuthIngressTitle(path),
    description: resolveAuthIngressDescription(path),
    surface,
  };
}

export function resolveAuthIngressTitle(
  path: AuthIngressCanonicalPath
): string {
  return resolveAuthRouteTitle(path);
}

export function resolveAuthIngressDescription(
  path: AuthIngressCanonicalPath
): string {
  return resolveAuthRouteDescription(path);
}

export function getAuthIngressCatalogEntry(path: AuthIngressCanonicalPath) {
  return getAuthRouteCatalogEntryByPath(path);
}
