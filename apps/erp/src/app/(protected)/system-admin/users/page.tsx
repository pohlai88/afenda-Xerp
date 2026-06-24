import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { ErpEmptyState } from "@/components/erp-empty-state";
import { SystemAdminInviteDialog } from "@/components/system-admin/system-admin-invite-dialog";
import { SYSTEM_ADMIN_USERS_EMPTY_STATE } from "@/lib/erp/erp-empty-state.contract";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { listSystemAdminInviteRoleOptions } from "@/lib/system-admin/list-system-admin-invite-role-options.server";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";
import type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";

function resolveSystemAdminUsersApiScope(
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

export default async function SystemAdminUsersPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("users");
  applySystemAdminSectionAccessNavigation(access);

  if (access.kind !== "allowed") {
    return null;
  }

  const roleOptions = await listSystemAdminInviteRoleOptions({
    tenantId: access.operatingContext.tenant.tenantId,
  });
  const apiScope = resolveSystemAdminUsersApiScope(access.operatingContext);

  return (
    <AppShellMain
      contentLabel="System admin users"
      description="Invite users and review the company-scoped directory scaffold."
      title="Users"
    >
      <div className="erp-system-admin-users">
        <ErpEmptyState {...SYSTEM_ADMIN_USERS_EMPTY_STATE} />
        <div className="erp-system-admin-users__actions">
          <SystemAdminInviteDialog
            apiScope={apiScope}
            roleOptions={roleOptions}
          />
        </div>
      </div>
    </AppShellMain>
  );
}
