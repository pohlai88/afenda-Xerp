import type { Metadata } from "next";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthWorkspaceSelectPanelLegacy } from "@/app/(auth)/_components/auth-workspace-select-panel";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";
import { loadAuthWorkspaceSelectPageData } from "@/lib/auth/load-auth-workspace-select-page.server";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.workspaceSelect.metadata;

export default async function WorkspaceSelectPage() {
  const { targets } = await loadAuthWorkspaceSelectPageData();

  return (
    <AuthEntryPage route="workspaceSelect">
      <AuthWorkspaceSelectPanelLegacy targets={targets} />
    </AuthEntryPage>
  );
}
