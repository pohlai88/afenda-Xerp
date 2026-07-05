import type { ReactNode } from "react";
import { getLabNavGroups } from "@/config/nav-config";
import { labDemoContext } from "@/lib/lab/lab-demo-context";
import { LabShell } from "./_components/lab-shell.client";

export const dynamic = "force-dynamic";

export default async function LabLayout({ children }: { children: ReactNode }) {
  const navGroups = getLabNavGroups("");

  return (
    <LabShell navGroups={navGroups} operatingContext={labDemoContext}>
      {children}
    </LabShell>
  );
}
