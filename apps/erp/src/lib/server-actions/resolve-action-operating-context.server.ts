import type { AfendaAuthSession } from "@afenda/auth";
import { resolveWireActorUserIdFromAfendaAuthSession } from "@afenda/auth";
import type { AppError, OperatingContext } from "@afenda/kernel";
import { AppErrors } from "@afenda/kernel";
import { headers } from "next/headers";

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
 */
export async function resolveActionOperatingContext(): Promise<ResolvedActionOperatingContext> {
  const sessionResult = await resolveActionSession();

  if (!sessionResult.ok) {
    return sessionResult;
  }

  resolveWireActorUserIdFromAfendaAuthSession(sessionResult.session);

  const operatingResult = await resolveOperatingContextFromHeaders({
    requestHeaders: await headers(),
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
