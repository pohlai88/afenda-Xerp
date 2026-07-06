import { getAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";

/** Redirects unauthenticated callers to sign-in before post-auth client islands render. */
export async function requireAuthenticatedAuthPage(): Promise<void> {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(AUTH_PATHS.signIn);
  }
}
