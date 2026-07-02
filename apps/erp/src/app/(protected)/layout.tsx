import { isAfendaAuthSessionLinked } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppProtectedShell } from "@/components/presentation/app-protected-shell.client";
import { readAfendaSessionCookieFromHeaders } from "@/lib/auth/read-session-cookie-from-headers.server";
import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { resolveUnauthenticatedRedirectPath } from "@/lib/auth/resolve-unauthenticated-redirect-path";
import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";
import { toShellOperatingContextWire } from "@/lib/context/to-shell-operating-context-wire";
import { resolveShellNavGroups } from "@/lib/navigation/resolve-shell-nav.server";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session, operatingResult } =
    await loadProtectedRequestOperatingContext();

  if (session === null) {
    const requestHeaders = await headers();
    const sessionCookie = readAfendaSessionCookieFromHeaders(requestHeaders);
    redirect(resolveUnauthenticatedRedirectPath(sessionCookie));
  }

  if (!isAfendaAuthSessionLinked(session)) {
    redirect("/sign-in?error=unlinked");
  }

  resolveProtectedPathActorUserIdFromSession(session);

  if (!operatingResult.ok) {
    redirect("/access-denied");
  }

  const operatingContext = toShellOperatingContextWire(operatingResult.value);
  const navGroups = await resolveShellNavGroups(operatingResult.value);

  return (
    <AppProtectedShell
      navGroups={navGroups}
      operatingContext={operatingContext}
    >
      {children}
    </AppProtectedShell>
  );
}
