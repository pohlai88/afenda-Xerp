import type { AfendaAuthSession } from "@afenda/auth";
import { resolveWireActorUserIdFromAfendaAuthSession } from "@afenda/auth";
import type {
  AppError,
  OperatingContext,
  OperatingContextSelection,
} from "@afenda/kernel";
import { AppErrors } from "@afenda/kernel";
import { headers } from "next/headers";

import { resolveOperatingContextOrchestrator } from "@/lib/context/resolve-operating-context-orchestrator.server";
import { buildOperatingContextSelectionFromRequest } from "@/lib/context/tenant-domain.server";
import { resolveCorrelationIdFromHeaders } from "@/lib/observability/resolve-correlation-id";

import { resolveActionSession } from "./resolve-action-session";

export type ResolvedActionOperatingContext =
  | {
      readonly ok: true;
      readonly operatingContext: OperatingContext;
      readonly session: AfendaAuthSession;
    }
  | { readonly ok: false; readonly error: AppError };

/**
 * Resolves auth session and verified operating context for protected server actions.
 * Client authority IDs in action payloads are rejected separately via
 * `parseProtectedActionInput`.
 */
export async function resolveActionOperatingContext(input?: {
  readonly selection?: Partial<Omit<OperatingContextSelection, "tenantSlug">>;
}): Promise<ResolvedActionOperatingContext> {
  const sessionResult = await resolveActionSession();
  if (!sessionResult.ok) {
    return sessionResult;
  }

  const actorUserId = resolveWireActorUserIdFromAfendaAuthSession(
    sessionResult.session
  );
  if (actorUserId.length === 0) {
    return { ok: false, error: AppErrors.unauthorized() };
  }

  const built = await buildOperatingContextSelectionFromRequest({
    activeWorkspaceId: sessionResult.session.metadata.activeWorkspaceId,
    ...(input?.selection === undefined ? {} : { selection: input.selection }),
  });

  if (!built.ok) {
    return {
      ok: false,
      error: AppErrors.forbidden(built.error.userMessage),
    };
  }

  const requestHeaders = await headers();
  const operatingResult = await resolveOperatingContextOrchestrator({
    actorUserId,
    correlationId: resolveCorrelationIdFromHeaders(requestHeaders),
    selection: built.selection,
  });

  if (!operatingResult.ok) {
    return {
      ok: false,
      error: AppErrors.forbidden(operatingResult.error.userMessage),
    };
  }

  return {
    ok: true,
    session: sessionResult.session,
    operatingContext: operatingResult.value,
  };
}
