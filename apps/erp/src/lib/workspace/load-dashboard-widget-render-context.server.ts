import type { SerializableDashboardWidgetRenderContext } from "@afenda/appshell";
import { getAfendaAuthSession, isAfendaAuthSessionLinked } from "@afenda/auth";
import { headers } from "next/headers";

import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";

import {
  emptyDashboardWidgetRenderContext,
  resolveDashboardWidgetRenderContextFromOperatingContext,
  resolveDevHarnessDashboardWidgetRenderContext,
} from "./resolve-dashboard-widget-render-context.server";

export interface LoadDashboardWidgetRenderContextOptions {
  /** When true, unauthenticated dev harness routes receive permissive demo grants. */
  readonly devFallback?: boolean;
}

/**
 * Loads serializable dashboard widget RBAC for the current request.
 *
 * Protected routes always resolve from verified operating context.
 * Dev harness routes may opt into permissive demo grants when unauthenticated.
 */
export async function loadDashboardWidgetRenderContextForRequest(
  options: LoadDashboardWidgetRenderContextOptions = {}
): Promise<SerializableDashboardWidgetRenderContext> {
  const session = await getAfendaAuthSession(await headers());

  if (session === null || !isAfendaAuthSessionLinked(session)) {
    return options.devFallback
      ? resolveDevHarnessDashboardWidgetRenderContext()
      : emptyDashboardWidgetRenderContext();
  }

  const actorUserId = resolveProtectedPathActorUserIdFromSession(session);
  const operatingResult = await resolveOperatingContextFromHeaders({
    actorUserId,
  });

  if (!operatingResult.ok) {
    return emptyDashboardWidgetRenderContext();
  }

  return resolveDashboardWidgetRenderContextFromOperatingContext(
    operatingResult.value
  );
}
