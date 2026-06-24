import { getDb, roles } from "@afenda/database";
import { and, asc, eq } from "drizzle-orm";

export interface SystemAdminInviteRoleOption {
  readonly description: string | null;
  readonly roleId: string;
  readonly roleName: string;
}

export async function listSystemAdminInviteRoleOptions(input: {
  readonly tenantId: string;
}): Promise<readonly SystemAdminInviteRoleOption[]> {
  const db = getDb();

  const rows = await db
    .select({
      description: roles.description,
      roleId: roles.id,
      roleName: roles.name,
    })
    .from(roles)
    .where(
      and(
        eq(roles.tenantId, input.tenantId),
        eq(roles.status, "active"),
        eq(roles.scope, "tenant")
      )
    )
    .orderBy(asc(roles.name));

  return rows;
}
