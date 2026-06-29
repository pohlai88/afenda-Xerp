import { getAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";

import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";

import { resolveMetadataActorUserIdFromAfendaAuthSession } from "./resolve-metadata-auth-actor.server";
import type { MetadataOperatorSurfaceWire } from "./resolve-metadata-operator-surface.server";
import { resolveMetadataOperatorSurface } from "./resolve-metadata-operator-surface.server";
import { resolveMetadataUiRenderContextFromTenantContext } from "./resolve-metadata-ui-render-context.server";

export type MetadataOperatorSurfacePageData =
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

export interface LoadMetadataOperatorSurfacePageInput {
  readonly description: string;
  readonly surfaceTemplateId: string;
  readonly title: string;
}

/** Shared spine + metadata ingress for operator metadata-driven routes. */
export async function loadMetadataOperatorSurfacePage(
  input: LoadMetadataOperatorSurfacePageInput
): Promise<MetadataOperatorSurfacePageData> {
  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);
  const operatingResult = await resolveOperatingContextFromHeaders({
    requestHeaders,
  });

  if (!operatingResult.ok) {
    return {
      kind: "error",
      title: input.title,
      message: operatingResult.error.userMessage,
    };
  }

  const actorId =
    session === null
      ? operatingResult.value.actor.userId
      : resolveMetadataActorUserIdFromAfendaAuthSession(session);

  const runtime = resolveMetadataUiRenderContextFromTenantContext({
    tenant: operatingResult.value.tenant,
    actorId,
    correlationId: operatingResult.value.correlationId,
  });

  const surface = resolveMetadataOperatorSurface({
    surfaceTemplateId: input.surfaceTemplateId,
    runtime,
  });

  if (surface === undefined) {
    return {
      kind: "error",
      title: input.title,
      message: "Surface template is not registered for this operator route.",
    };
  }

  return {
    kind: "ready",
    title: input.title,
    description: input.description,
    surface,
  };
}
