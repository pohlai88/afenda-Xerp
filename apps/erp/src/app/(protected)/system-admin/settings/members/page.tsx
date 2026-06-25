import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { SystemAdminInviteDialog } from "@/components/system-admin/system-admin-invite-dialog";
import { SystemAdminMembersSettingsPanel } from "@/components/system-admin/system-admin-members-settings-panel";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { listSystemAdminInviteRoleOptions } from "@/lib/system-admin/list-system-admin-invite-role-options.server";
import { resolveMembersSettings } from "@/lib/system-admin/resolve-members-settings.server";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";
import { mapInviteRoleOptions } from "@/lib/system-admin/system-admin-settings-blocks.contract";
import type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";

function resolveMembersApiScope(
  operatingContext: Extract<
    Awaited<ReturnType<typeof resolveSystemAdminSectionAccess>>,
    { readonly kind: "allowed" }
  >["operatingContext"]
): WorkspaceApiScope {
  return {
    companyId: operatingContext.legalEntity.companyId,
    companySlug: operatingContext.legalEntity.slug,
    organizationId:
      operatingContext.organizationUnit?.organizationUnitId ?? null,
    organizationSlug: operatingContext.organizationUnit?.slug ?? null,
    tenantSlug: operatingContext.tenant.slug,
    workspaceId: operatingContext.workspace.companyId,
  };
}

export default async function SystemAdminSettingsMembersPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  if (access.kind !== "allowed") {
    return (
      <AppShellMain
        contentLabel="Members settings"
        description="Membership policies and invite configuration."
        title="Members"
      >
        <p>Members settings are not available for your current access level.</p>
      </AppShellMain>
    );
  }

  const roleOptions = await listSystemAdminInviteRoleOptions({
    tenantId: access.operatingContext.tenant.tenantId,
  });
  const membersSettings = await resolveMembersSettings({
    companyId: access.operatingContext.legalEntity.companyId,
    tenantId: access.operatingContext.tenant.tenantId,
  });
  const apiScope = resolveMembersApiScope(access.operatingContext);

  return (
    <AppShellMain
      contentLabel="Members settings"
      description="Membership policies and invite configuration."
      title="Members"
    >
      <SystemAdminMembersSettingsPanel
        apiScope={apiScope}
        companyId={access.operatingContext.legalEntity.companyId}
        inviteSlot={
          <SystemAdminInviteDialog
            apiScope={apiScope}
            roleOptions={roleOptions}
          />
        }
        members={membersSettings.members}
        pendingInvites={membersSettings.pendingInvites}
        roleOptions={mapInviteRoleOptions(roleOptions)}
      />
    </AppShellMain>
  );
}
