import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { listPermissionRegistryEntries } from "@/lib/system-admin/list-permission-registry-entries";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminPermissionsPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("permissions");
  applySystemAdminSectionAccessNavigation(access);

  const permissionEntries = listPermissionRegistryEntries();

  return (
    <AppShellMain
      contentLabel="System admin permissions catalog"
      description="Read-only catalog of registered permission keys from PERMISSION_REGISTRY."
      title="Permissions"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Registered permission keys from PERMISSION_REGISTRY
        </caption>
        <thead>
          <tr>
            <th className="border-b px-3 py-2 text-left" scope="col">
              Domain
            </th>
            <th className="border-b px-3 py-2 text-left" scope="col">
              Action
            </th>
            <th className="border-b px-3 py-2 text-left" scope="col">
              Key
            </th>
          </tr>
        </thead>
        <tbody>
          {permissionEntries.map((entry) => (
            <tr key={entry.key}>
              <td className="border-b px-3 py-2">{entry.domain}</td>
              <td className="border-b px-3 py-2">{entry.action}</td>
              <td className="border-b px-3 py-2">
                <code>{entry.key}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppShellMain>
  );
}
