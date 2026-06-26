import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthWorkspaceSelectPanel } from "@/app/(auth)/_components/auth-workspace-select-panel";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";
import { loadAuthOrganizationSelectPageData } from "@/lib/auth/load-auth-workspace-select-page.server";

export const metadata = AUTH_ROUTE_REGISTRY.organizationSelect.metadata;

export default async function AuthOrganizationSelectPage() {
  const { targets } = await loadAuthOrganizationSelectPageData();

  return (
    <AuthEntryPage route="organizationSelect">
      <AuthWorkspaceSelectPanel targets={targets} />
    </AuthEntryPage>
  );
}
