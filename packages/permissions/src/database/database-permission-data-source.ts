import {
  type AfendaDatabase,
  companies,
  getDb,
  memberships,
  type PermissionKey,
  permissions,
  rolePermissions,
  roles,
  tenants,
  users,
} from "@afenda/database";
import { and, eq } from "drizzle-orm";

import type { MembershipContract } from "../scope/membership.contract.js";
import type { PermissionDataSource } from "../grants/permission-checker.js";
import type { RoleContract } from "../grants/role.contract.js";
import type { TenantContract } from "../tenant.contract.js";
import type { PlatformUserContract } from "../user.contract.js";
import {
  toMembershipContract,
  toPermissionKeys,
  toPlatformUserContract,
  toRoleContract,
  toTenantContract,
} from "./contract-mappers.js";

/** Postgres-backed `PermissionDataSource` for production authorization checks. */
export class DatabasePermissionDataSource implements PermissionDataSource {
  private readonly db: AfendaDatabase;

  constructor(db: AfendaDatabase = getDb()) {
    this.db = db;
  }

  async findMembershipsForActor(input: {
    actorId: string;
    tenantId: string;
  }): Promise<readonly MembershipContract[]> {
    const rows = await this.db
      .select({
        id: memberships.id,
        tenantId: memberships.tenantId,
        companyId: memberships.companyId,
        organizationId: memberships.organizationId,
        userId: memberships.userId,
        roleId: memberships.roleId,
        scopeType: memberships.scopeType,
        status: memberships.status,
      })
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, input.actorId),
          eq(memberships.tenantId, input.tenantId)
        )
      );

    return rows.map(toMembershipContract);
  }

  async getPermissionsForRole(
    roleId: string
  ): Promise<readonly PermissionKey[]> {
    const rows = await this.db
      .select({ key: permissions.key })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    return toPermissionKeys(rows);
  }

  async getPlatformUser(actorId: string): Promise<PlatformUserContract | null> {
    const [row] = await this.db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, actorId))
      .limit(1);

    return row ? toPlatformUserContract(row) : null;
  }

  async getRole(roleId: string): Promise<RoleContract | null> {
    const [row] = await this.db
      .select({
        id: roles.id,
        tenantId: roles.tenantId,
        key: roles.key,
        name: roles.name,
        description: roles.description,
        scope: roles.scope,
        status: roles.status,
      })
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    return row ? toRoleContract(row) : null;
  }

  async getTenant(tenantId: string): Promise<TenantContract | null> {
    const [row] = await this.db
      .select({
        id: tenants.id,
        slug: tenants.slug,
        name: tenants.name,
        status: tenants.status,
      })
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);

    return row ? toTenantContract(row) : null;
  }

  async isCompanyInTenant(
    companyId: string,
    tenantId: string
  ): Promise<boolean> {
    const [row] = await this.db
      .select({ id: companies.id })
      .from(companies)
      .where(and(eq(companies.id, companyId), eq(companies.tenantId, tenantId)))
      .limit(1);

    return Boolean(row);
  }
}

export function createProductionPermissionDataSource(
  db: AfendaDatabase = getDb()
): DatabasePermissionDataSource {
  return new DatabasePermissionDataSource(db);
}
