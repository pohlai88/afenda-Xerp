import { isAfendaAuthSessionLinked } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppProtectedShell } from "@/components/presentation/app-protected-shell.client";
import { readAfendaSessionCookieFromHeaders } from "@/lib/auth/read-session-cookie-from-headers.server";
import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { resolveUnauthenticatedRedirectPath } from "@/lib/auth/resolve-unauthenticated-redirect-path";
import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";
import { toAppShellOperatingContextWire } from "@/lib/context/to-app-shell-operating-context";
import { toPresentationShellOperatingContext } from "@/lib/context/to-presentation-shell-operating-context";
import { resolveAppShellNavGroups } from "@/lib/navigation/resolve-app-shell-nav.server";

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

  const presentationContext = toPresentationShellOperatingContext(
    operatingResult.value
  );
  const operatingContext = toAppShellOperatingContextWire(presentationContext);
  const navGroups = await resolveAppShellNavGroups(operatingResult.value);

  return (
    <AppProtectedShell
      navGroups={navGroups}
      operatingContext={operatingContext}
    >
      {children}
    </AppProtectedShell>
  );
}
