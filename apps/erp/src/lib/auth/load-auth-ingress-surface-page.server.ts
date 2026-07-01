import { createMetadataRuntimeContext } from "@/lib/metadata/metadata-runtime.contract.js";
import type { MetadataOperatorSurfaceWire } from "@/lib/metadata/resolve-metadata-operator-surface.server.js";
import { resolveMetadataOperatorSurface } from "@/lib/metadata/resolve-metadata-operator-surface.server.js";

import {
  type AuthIngressCanonicalPath,
  getAuthIngressSurfaceByPath,
} from "./auth-ingress-surface.registry.js";

export type AuthIngressSurfacePageData =
  | {
      readonly kind: "error";
      readonly message: string;
      readonly title: string;
    }
  | {
      readonly description: string;
      readonly kind: "ready";
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
      title: "Sign in",
      message: "The sign-in surface template is not registered.",
    };
  }

  return {
    kind: "ready",
    title: "Sign in",
    description: "Access your Afenda ERP operator workspace.",
    surface,
  };
}
