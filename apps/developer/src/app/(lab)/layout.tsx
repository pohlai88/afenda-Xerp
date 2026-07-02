import type { ReactNode } from "react";

import { LabShell } from "@/components/lab-shell.client";
import { labNavGroups } from "@/config/nav-config";
import { labDemoOperatingContext } from "@/lib/lab/lab-demo-context";

export const dynamic = "force-dynamic";

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <LabShell
      navGroups={labNavGroups}
      operatingContext={labDemoOperatingContext}
    >
      {children}
    </LabShell>
  );
}
