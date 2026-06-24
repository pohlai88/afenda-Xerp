import { requireAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";

/** Protected-surface session guard — see `auth-protected-surface.registry.ts` (`session-guard`). */
export async function requireSession() {
  return requireAfendaAuthSession(await headers());
}
