import type { AfendaAuthSession } from "@afenda/auth";
import type {
  AppError,
  OperatingContext,
  OperatingContextSelection,
} from "@afenda/kernel";
import { AppErrors } from "@afenda/kernel";

import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";

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

  const actorUserId = sessionResult.session.user.userId?.trim() ?? "";
  if (actorUserId.length === 0) {
    return { ok: false, error: AppErrors.unauthorized() };
  }

  const operatingResult = await resolveOperatingContextFromHeaders({
    actorUserId,
    ...(input?.selection === undefined ? {} : { selection: input.selection }),
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
