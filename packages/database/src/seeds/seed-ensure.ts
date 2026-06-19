import { and, eq, isNull } from "drizzle-orm";
import type { CompanyWriteInput } from "../company/company.contract.js";
import { insertCompany } from "../company/company.service.js";
import type { AfendaDatabase } from "../db.js";
import type { MembershipWriteInput } from "../membership/membership.contract.js";
import { insertMembership } from "../membership/membership.service.js";
import type { OrganizationWriteInput } from "../organization/organization.contract.js";
import { insertOrganization } from "../organization/organization.service.js";
import type { PermissionCatalogWriteInput } from "../permission/permission.contract.js";
import { insertPermission } from "../permission/permission.service.js";
import { assertPermissionKey } from "../permission-key.contract.js";
import type { PolicyWriteInput } from "../policy/policy.contract.js";
import { insertPolicy } from "../policy/policy.service.js";
import type { RoleWriteInput } from "../role/role.contract.js";
import { insertRole } from "../role/role.service.js";
import { grantPermissionToRole } from "../role-permission/role-permission.service.js";
import { companies } from "../schema/company.schema.js";
import { memberships } from "../schema/membership.schema.js";
import { organizations } from "../schema/organization.schema.js";
import { permissions } from "../schema/permission.schema.js";
import { policies } from "../schema/policy.schema.js";
import { roles } from "../schema/role.schema.js";
import { rolePermissions } from "../schema/role-permission.schema.js";
import { tenants } from "../schema/tenant.schema.js";
import { users } from "../schema/user.schema.js";
import type { TenantWriteInput } from "../tenant/tenant.contract.js";
import { insertTenant } from "../tenant/tenant.service.js";
import type { PlatformUserWriteInput } from "../user/user.contract.js";
import { assertEmail } from "../user/user.contract.js";
import { insertUser } from "../user/user.service.js";
import type { SeedAuditBundle } from "./seed-context.js";
import type { SeedEnsureResult, SeedGrantResult } from "./seed-types.js";

export async function ensurePermission(
  input: PermissionCatalogWriteInput,
  audit: SeedAuditBundle,
  db: AfendaDatabase
): Promise<SeedEnsureResult> {
  const key = assertPermissionKey(input.key);
  const [existing] = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(eq(permissions.key, key))
    .limit(1);

  if (existing) {
    return { key, id: existing.id, created: false };
  }

  const inserted = await insertPermission(
    {
      ...input,
      audit: audit.permission,
    },
    db
  );

  return { key, id: inserted.id, created: true };
}

export async function ensureRole(
  input: RoleWriteInput,
  audit: SeedAuditBundle,
  db: AfendaDatabase
): Promise<SeedEnsureResult> {
  const [existing] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(
      input.tenantId
        ? and(eq(roles.tenantId, input.tenantId), eq(roles.key, input.key))
        : and(isNull(roles.tenantId), eq(roles.key, input.key))
    )
    .limit(1);

  if (existing) {
    return { key: input.key, id: existing.id, created: false };
  }

  const inserted = await insertRole(
    {
      ...input,
      audit: audit.role,
    },
    db
  );

  return { key: input.key, id: inserted.id, created: true };
}

export async function ensurePolicy(
  input: PolicyWriteInput,
  audit: SeedAuditBundle,
  db: AfendaDatabase
): Promise<SeedEnsureResult> {
  const [existing] = await db
    .select({ id: policies.id })
    .from(policies)
    .where(
      input.tenantId
        ? and(
            eq(policies.tenantId, input.tenantId),
            eq(policies.key, input.key)
          )
        : and(isNull(policies.tenantId), eq(policies.key, input.key))
    )
    .limit(1);

  if (existing) {
    return { key: input.key, id: existing.id, created: false };
  }

  const inserted = await insertPolicy(
    {
      ...input,
      audit: audit.policy,
    },
    db
  );

  return { key: input.key, id: inserted.id, created: true };
}

export async function ensureRolePermissionGrant(input: {
  readonly audit: SeedAuditBundle;
  readonly db: AfendaDatabase;
  readonly permissionId: string;
  readonly permissionKey: string;
  readonly reason: string;
  readonly roleId: string;
  readonly roleKey: string;
  readonly tenantId: string | null;
}): Promise<SeedGrantResult> {
  const [existing] = await input.db
    .select({ roleId: rolePermissions.roleId })
    .from(rolePermissions)
    .where(
      and(
        eq(rolePermissions.roleId, input.roleId),
        eq(rolePermissions.permissionId, input.permissionId)
      )
    )
    .limit(1);

  await grantPermissionToRole(
    {
      tenantId: input.tenantId,
      roleId: input.roleId,
      permissionId: input.permissionId,
      reason: input.reason,
      audit: input.audit.rolePermission,
    },
    input.db
  );

  return {
    roleKey: input.roleKey,
    permissionKey: input.permissionKey,
    created: !existing,
  };
}

export async function ensureTenant(
  input: TenantWriteInput,
  audit: SeedAuditBundle,
  db: AfendaDatabase
): Promise<SeedEnsureResult> {
  const [existing] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.slug, input.slug))
    .limit(1);

  if (existing) {
    return { key: input.slug, id: existing.id, created: false };
  }

  const inserted = await insertTenant(
    {
      ...input,
      audit: audit.tenant,
    },
    db
  );

  return { key: input.slug, id: inserted.id, created: true };
}

export async function ensureCompany(
  input: CompanyWriteInput,
  audit: SeedAuditBundle,
  db: AfendaDatabase
): Promise<SeedEnsureResult> {
  const [existing] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(
      and(
        eq(companies.tenantId, input.tenantId),
        eq(companies.slug, input.slug)
      )
    )
    .limit(1);

  if (existing) {
    return { key: input.slug, id: existing.id, created: false };
  }

  const inserted = await insertCompany(
    {
      ...input,
      audit: audit.company,
    },
    db
  );

  return { key: input.slug, id: inserted.id, created: true };
}

export async function ensureOrganization(
  input: OrganizationWriteInput,
  audit: SeedAuditBundle,
  db: AfendaDatabase
): Promise<SeedEnsureResult> {
  const [existing] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(
      and(
        eq(organizations.tenantId, input.tenantId),
        eq(organizations.companyId, input.companyId),
        eq(organizations.slug, input.slug)
      )
    )
    .limit(1);

  if (existing) {
    return { key: input.slug, id: existing.id, created: false };
  }

  const inserted = await insertOrganization(
    {
      ...input,
      audit: audit.organization,
    },
    db
  );

  return { key: input.slug, id: inserted.id, created: true };
}

export async function ensureUser(
  input: PlatformUserWriteInput,
  audit: SeedAuditBundle,
  db: AfendaDatabase
): Promise<SeedEnsureResult> {
  const email = assertEmail(input.email);
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { key: email, id: existing.id, created: false };
  }

  const inserted = await insertUser(
    {
      ...input,
      email,
      audit: audit.user,
    },
    db
  );

  return { key: email, id: inserted.id, created: true };
}

export async function ensureMembership(
  input: MembershipWriteInput,
  audit: SeedAuditBundle,
  db: AfendaDatabase
): Promise<SeedEnsureResult> {
  const membershipKey = [
    input.userId,
    input.tenantId,
    input.scopeType,
    input.companyId ?? "tenant",
    input.organizationId ?? "none",
    input.roleId,
  ].join(":");

  const [existing] = await db
    .select({ id: memberships.id })
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, input.userId),
        eq(memberships.tenantId, input.tenantId),
        eq(memberships.roleId, input.roleId),
        eq(memberships.scopeType, input.scopeType)
      )
    )
    .limit(1);

  if (existing) {
    return { key: membershipKey, id: existing.id, created: false };
  }

  const inserted = await insertMembership(
    {
      ...input,
      audit: audit.membership,
    },
    db
  );

  return { key: membershipKey, id: inserted.id, created: true };
}

export async function findPermissionIdByKey(
  key: string,
  db: AfendaDatabase
): Promise<string | null> {
  const permissionKey = assertPermissionKey(key);
  const [row] = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(eq(permissions.key, permissionKey))
    .limit(1);

  return row?.id ?? null;
}

export async function findRoleIdByKey(
  input: { readonly key: string; readonly tenantId: string | null },
  db: AfendaDatabase
): Promise<string | null> {
  const [row] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(
      input.tenantId
        ? and(eq(roles.tenantId, input.tenantId), eq(roles.key, input.key))
        : and(isNull(roles.tenantId), eq(roles.key, input.key))
    )
    .limit(1);

  return row?.id ?? null;
}
