import type { SystemAdminRoleRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export interface SystemAdminRolesTableProps {
  readonly roles: readonly SystemAdminRoleRowDto[];
}

export function SystemAdminRolesTable({ roles }: SystemAdminRolesTableProps) {
  if (roles.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No roles are configured for this tenant yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Key</th>
            <th className="px-4 py-3 font-medium">Scope</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr className="border-b last:border-b-0" key={role.id}>
              <td className="px-4 py-3 font-medium">{role.name}</td>
              <td className="px-4 py-3 font-mono text-xs">{role.key}</td>
              <td className="px-4 py-3 capitalize">{role.scope}</td>
              <td className="px-4 py-3 capitalize">{role.status}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {role.description ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
