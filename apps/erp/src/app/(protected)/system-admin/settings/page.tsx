import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminSettingsPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  const { operatingContext } = access;
  const { tenant, legalEntity, permissionScope } = operatingContext;

  return (
    <AppShellMain
      contentLabel="System admin settings"
      description="Read-only organization and platform configuration scaffold. Mutations arrive in a future delivery slice."
      title="Settings"
    >
      <p className="rounded-md border px-4 py-3" role="note">
        <strong>Read-only.</strong> This page displays current operating context
        only. Organization, security, and module configuration changes are not
        available until admin API contracts land in a future slice.
      </p>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium">Tenant</dt>
          <dd>{tenant.displayName}</dd>
          <dd>
            <code>{tenant.slug}</code>
          </dd>
          <dd>
            <code>{tenant.tenantId}</code>
          </dd>
        </div>
        <div>
          <dt className="font-medium">Legal entity</dt>
          <dd>{legalEntity.displayName}</dd>
          <dd>
            <code>{legalEntity.slug}</code>
          </dd>
          <dd>
            <code>{legalEntity.companyId}</code>
          </dd>
        </div>
        <div>
          <dt className="font-medium">Permission scope</dt>
          <dd>Grant scope: {permissionScope.grantScopeType}</dd>
          <dd>
            Tenant: <code>{permissionScope.tenantId}</code>
          </dd>
          <dd>
            Company: <code>{permissionScope.companyId ?? "—"}</code>
          </dd>
        </div>
      </dl>
      <p>
        Organization, security, and module configuration mutations are deferred
        until admin API contracts land. No accounting settings are exposed here.
      </p>
    </AppShellMain>
  );
}
