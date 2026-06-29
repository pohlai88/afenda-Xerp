import { getAfendaAuthSession, isAfendaAuthSessionLinked } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";
import { toPresentationShellOperatingContext } from "@/lib/context/to-presentation-shell-operating-context";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);

  if (session === null) {
    redirect("/sign-in");
  }

  if (!isAfendaAuthSessionLinked(session)) {
    redirect("/sign-in?error=unlinked");
  }

  resolveProtectedPathActorUserIdFromSession(session);

  const operatingResult = await resolveOperatingContext({
    requestHeaders,
    session,
  });

  if (!operatingResult.ok) {
    redirect("/access-denied");
  }

  const presentationContext = toPresentationShellOperatingContext(
    operatingResult.value
  );

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-tenant-label={presentationContext.tenantLabel}
      data-workspace-label={presentationContext.workspaceLabel}
    >
      {children}
    </div>
  );
}
