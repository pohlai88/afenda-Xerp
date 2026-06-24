import { AppShellMain } from "@afenda/appshell";

import { ProtectedWorkspaceDashboard } from "@/components/protected-workspace-dashboard.client";
import {
  WORKSPACE_HOME_COPY,
  WORKSPACE_HOME_PAGE_TITLE_ID,
} from "@/lib/workspace/workspace-home.copy.contract";

export default function HomePage() {
  return (
    <AppShellMain
      contentLabel={WORKSPACE_HOME_COPY.page.contentLabel}
      description={WORKSPACE_HOME_COPY.page.description}
      title={WORKSPACE_HOME_COPY.page.title}
      titleId={WORKSPACE_HOME_PAGE_TITLE_ID}
    >
      <ProtectedWorkspaceDashboard />
    </AppShellMain>
  );
}
