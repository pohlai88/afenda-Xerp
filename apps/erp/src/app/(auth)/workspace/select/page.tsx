import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthWorkspaceSelectPanel } from "@/app/(auth)/_components/auth-workspace-select-panel";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";
import { loadAuthWorkspaceSelectPageData } from "@/lib/auth/load-auth-workspace-select-page.server";

export const metadata = AUTH_ROUTE_REGISTRY.workspaceSelect.metadata;

export default async function AuthWorkspaceSelectPage() {
  const { targets } = await loadAuthWorkspaceSelectPageData();

  return (
    <AuthEntryPage route="workspaceSelect">
      <AuthWorkspaceSelectPanel targets={targets} />
    </AuthEntryPage>
  );
}
