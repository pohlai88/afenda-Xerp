import { AppShell } from "@afenda/appshell";
import { getAfendaAuthSession, toAfendaAuthIdentity } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/sign-out-button";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAfendaAuthSession(await headers());

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <AppShell
      identity={toAfendaAuthIdentity(session)}
      identityAccessory={<SignOutButton />}
    >
      {children}
    </AppShell>
  );
}
