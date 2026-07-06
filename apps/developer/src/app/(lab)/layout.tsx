import type { ReactNode } from "react";
import { getLabNavGroups } from "@/config/nav-config";
import { resolveLabShellOperatingContext } from "@/lib/lab/resolve-lab-shell-operating-context.server";
import { LabShell } from "./_components/lab-shell.client";

export const dynamic = "force-dynamic";

export default async function LabLayout({ children }: { children: ReactNode }) {
  const navGroups = getLabNavGroups("");
  const { operatingContext } = await resolveLabShellOperatingContext();

  return (
    <LabShell navGroups={navGroups} operatingContext={operatingContext}>
      {children}
    </LabShell>
  );
}
