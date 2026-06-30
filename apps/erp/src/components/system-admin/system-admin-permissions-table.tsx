import type { SystemAdminPermissionRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export interface SystemAdminPermissionsTableProps {
  readonly permissions: readonly SystemAdminPermissionRowDto[];
}

export function SystemAdminPermissionsTable({
  permissions,
}: SystemAdminPermissionsTableProps) {
  if (permissions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No permissions are registered in the catalog yet.
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
            <th className="px-4 py-3 font-medium">Domain</th>
            <th className="px-4 py-3 font-medium">Action</th>
            <th className="px-4 py-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr className="border-b last:border-b-0" key={permission.id}>
              <td className="px-4 py-3 font-medium">{permission.name}</td>
              <td className="px-4 py-3 font-mono text-xs">{permission.key}</td>
              <td className="px-4 py-3">{permission.domain}</td>
              <td className="px-4 py-3">{permission.action}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {permission.description ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
