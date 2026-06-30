import type { SystemAdminMembershipRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export interface SystemAdminMembershipsTableProps {
  readonly memberships: readonly SystemAdminMembershipRowDto[];
}

export function SystemAdminMembershipsTable({
  memberships,
}: SystemAdminMembershipsTableProps) {
  if (memberships.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No active memberships exist for this company scope yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Member</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Membership ID</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((membership) => (
            <tr
              className="border-b last:border-b-0"
              key={membership.membershipId}
            >
              <td className="px-4 py-3 font-medium">
                {membership.displayName}
              </td>
              <td className="px-4 py-3">{membership.email}</td>
              <td className="px-4 py-3">
                {membership.roleName}
                <span className="ml-2 font-mono text-muted-foreground text-xs">
                  {membership.roleKey}
                </span>
              </td>
              <td className="px-4 py-3 capitalize">
                {membership.membershipStatus}
              </td>
              <td className="px-4 py-3 font-mono text-xs">
                {membership.membershipId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
