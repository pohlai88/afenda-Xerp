import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2WorkspaceSelectPanel } from "@/app/(auth-v2)/_components/auth-v2-workspace-select-panel";
import { loadAuthOrganizationSelectPageData } from "@/lib/auth/load-auth-workspace-select-page.server";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.organizationSelect.metadata;

export default async function AuthV2OrganizationSelectPage() {
  const { targets } = await loadAuthOrganizationSelectPageData();

  return (
    <AuthV2EntryPage route="organizationSelect">
      <AuthV2WorkspaceSelectPanel targets={targets} />
    </AuthV2EntryPage>
  );
}
