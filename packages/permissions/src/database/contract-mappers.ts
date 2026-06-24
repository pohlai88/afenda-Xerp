import {
  assertPermissionKey,
  type PermissionKey,
  parsePolicyCondition,
} from "@afenda/database";
import type { RoleContract } from "../grants/role.contract.js";
import type { PolicyContract } from "../policy.contract.js";
import type { MembershipContract } from "../scope/membership.contract.js";
import type { TenantContract } from "../tenant.contract.js";
import type { PlatformUserContract } from "../user.contract.js";

interface MembershipRow {
  readonly companyId: string | null;
  readonly entityGroupId: string | null;
  readonly id: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly roleId: string;
  readonly scopeType: MembershipContract["scopeType"];
  readonly status: MembershipContract["status"];
  readonly teamId: string | null;
  readonly tenantId: string;
  readonly userId: string;
}

interface RoleRow {
  readonly description: string | null;
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly scope: RoleContract["scope"];
  readonly status: RoleContract["status"];
  readonly tenantId: string | null;
}

interface TenantRow {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly status: TenantContract["status"];
}

interface UserRow {
  readonly displayName: string;
  readonly email: string;
  readonly id: string;
  readonly status: PlatformUserContract["status"];
}

interface PolicyRow {
  readonly condition: unknown;
  readonly description: string | null;
  readonly effect: PolicyContract["effect"];
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly priority: number;
  readonly scope: PolicyContract["scope"];
  readonly status: PolicyContract["status"];
  readonly tenantId: string | null;
}

export function toMembershipContract(row: MembershipRow): MembershipContract {
  return {
    id: row.id,
    tenantId: row.tenantId,
    companyId: row.companyId,
    entityGroupId: row.entityGroupId,
    organizationId: row.organizationId,
    projectId: row.projectId,
    teamId: row.teamId,
    userId: row.userId,
    roleId: row.roleId,
    scopeType: row.scopeType,
    status: row.status,
  };
}

export function toRoleContract(row: RoleRow): RoleContract {
  return {
    id: row.id,
    tenantId: row.tenantId,
    key: row.key,
    name: row.name,
    description: row.description,
    scope: row.scope,
    status: row.status,
  };
}

export function toTenantContract(row: TenantRow): TenantContract {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    status: row.status,
  };
}

export function toPlatformUserContract(row: UserRow): PlatformUserContract {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    status: row.status,
  };
}

export function toPolicyContract(row: PolicyRow): PolicyContract {
  return {
    id: row.id,
    tenantId: row.tenantId,
    key: row.key,
    name: row.name,
    description: row.description,
    scope: row.scope,
    effect: row.effect,
    priority: row.priority,
    condition: parsePolicyCondition(row.condition),
    status: row.status,
  };
}

export function toPermissionKeys(
  rows: readonly { readonly key: string }[]
): PermissionKey[] {
  return rows.map((row) => assertPermissionKey(row.key));
}
