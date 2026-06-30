import { isAfendaAuthSessionLinked } from "@afenda/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { ErpProtectedShell } from "@/components/presentation/erp-protected-shell.client";
import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";
import { toErpShellOperatingContextWire } from "@/lib/context/to-erp-shell-operating-context";
import { toPresentationShellOperatingContext } from "@/lib/context/to-presentation-shell-operating-context";
import { resolveErpNavGroups } from "@/lib/navigation/resolve-erp-nav.server";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session, operatingResult } =
    await loadProtectedRequestOperatingContext();

  if (session === null) {
    redirect("/sign-in");
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
  const operatingContext = toErpShellOperatingContextWire(presentationContext);
  const navGroups = await resolveErpNavGroups(operatingResult.value);

  return (
    <ErpProtectedShell
      navGroups={navGroups}
      operatingContext={operatingContext}
    >
      {children}
    </ErpProtectedShell>
  );
}
