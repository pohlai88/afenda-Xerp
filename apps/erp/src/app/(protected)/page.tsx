import { AppShellMain } from "@afenda/appshell";

import { ProtectedWorkspaceDashboard } from "@/components/protected-workspace-dashboard.client";

export default function HomePage() {
  return (
    <AppShellMain
      contentLabel="Workspace dashboard"
      description="Overview widgets filtered by your workspace permissions."
      title="Workspace home"
    >
      <ProtectedWorkspaceDashboard />
    </AppShellMain>
  );
}
