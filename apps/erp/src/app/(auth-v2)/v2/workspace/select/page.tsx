import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2WorkspaceSelectPanel } from "@/app/(auth-v2)/_components/auth-v2-workspace-select-panel";
import { loadAuthWorkspaceSelectPageData } from "@/lib/auth/load-auth-workspace-select-page.server";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.workspaceSelect.metadata;

export default async function AuthV2WorkspaceSelectPage() {
  const { targets } = await loadAuthWorkspaceSelectPageData();

  return (
    <AuthV2EntryPage route="workspaceSelect">
      <AuthV2WorkspaceSelectPanel targets={targets} />
    </AuthV2EntryPage>
  );
}
