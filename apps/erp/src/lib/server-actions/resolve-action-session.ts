import type { AfendaAuthSession } from "@afenda/auth";
import { getAfendaAuthSession, isAfendaAuthSessionLinked } from "@afenda/auth";
import type { AppError } from "@afenda/kernel";
import { AppErrors } from "@afenda/kernel";
import { headers } from "next/headers";

export type ResolvedActionSession =
  | { readonly ok: true; readonly session: AfendaAuthSession }
  | { readonly ok: false; readonly error: AppError };

export async function resolveActionSession(): Promise<ResolvedActionSession> {
  try {
    const session = await getAfendaAuthSession(await headers());

    if (session === null) {
      return { ok: false, error: AppErrors.unauthorized() };
    }

    if (!isAfendaAuthSessionLinked(session)) {
      return { ok: false, error: AppErrors.forbidden() };
    }

    return { ok: true, session };
  } catch {
    return { ok: false, error: AppErrors.internal() };
  }
}
