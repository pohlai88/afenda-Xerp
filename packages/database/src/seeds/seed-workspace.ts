import type { AfendaDatabase } from "../db.js";
import { DEV_TENANT_ROLE_CATALOG } from "./platform-roles.catalog.js";
import { createSeedAuditBundle } from "./seed-context.js";
import {
  ensureCompany,
  ensureMembership,
  ensureOrganization,
  ensureRole,
  ensureRolePermissionGrant,
  ensureTenant,
  ensureUser,
  findPermissionIdByKey,
  findRoleIdByKey,
} from "./seed-ensure.js";
import { seedPlatformCatalog } from "./seed-platform.js";
import type {
  SeedEnsureResult,
  SeedProfile,
  SeedRunResult,
  WorkspaceSeedResult,
} from "./seed-types.js";
import type { WorkspaceFixture } from "./workspace-fixtures.js";

export async function seedDevWorkspace(
  profile: SeedProfile,
  fixture: WorkspaceFixture,
  db: AfendaDatabase
): Promise<WorkspaceSeedResult> {
  const audit = createSeedAuditBundle(profile);

  const tenant = await ensureTenant(
    {
      slug: fixture.tenant.slug,
      name: fixture.tenant.name,
    },
    audit,
    db
  );

  const company = await ensureCompany(
    {
      tenantId: tenant.id,
      slug: fixture.company.slug,
      legalName: fixture.company.legalName,
      displayName: fixture.company.displayName,
      countryCode: fixture.company.countryCode,
      baseCurrency: fixture.company.baseCurrency,
      registrationNumber: fixture.company.registrationNumber,
    },
    audit,
    db
  );

  const organization = await ensureOrganization(
    {
      tenantId: tenant.id,
      companyId: company.id,
      slug: fixture.organization.slug,
      name: fixture.organization.name,
      type: fixture.organization.type,
    },
    audit,
    db
  );

  const tenantRoleResults: SeedEnsureResult[] = [];

  for (const role of DEV_TENANT_ROLE_CATALOG) {
    tenantRoleResults.push(
      await ensureRole(
        {
          tenantId: tenant.id,
          key: role.key,
          name: role.name,
          description: role.description,
          scope: role.scope,
        },
        audit,
        db
      )
    );
  }

  const tenantAdminRole =
    tenantRoleResults.find((role) => role.key === "tenant.admin") ??
    tenantRoleResults[0];

  if (!tenantAdminRole) {
    throw new Error("Tenant admin role was not seeded.");
  }

  for (const role of DEV_TENANT_ROLE_CATALOG) {
    const roleId =
      (await findRoleIdByKey({ key: role.key, tenantId: tenant.id }, db)) ??
      tenantAdminRole.id;

    for (const permissionKey of role.permissionKeys) {
      const permissionId = await findPermissionIdByKey(permissionKey, db);

      if (!permissionId) {
        throw new Error(
          `Permission "${permissionKey}" must be seeded before workspace grants.`
        );
      }

      await ensureRolePermissionGrant({
        audit,
        db,
        tenantId: tenant.id,
        roleId,
        roleKey: role.key,
        permissionId,
        permissionKey,
        reason: `${profile} workspace seed`,
      });
    }
  }

  const user = await ensureUser(
    {
      email: fixture.user.email,
      displayName: fixture.user.displayName,
    },
    audit,
    db
  );

  const membership = await ensureMembership(
    {
      tenantId: tenant.id,
      companyId: company.id,
      organizationId: null,
      userId: user.id,
      roleId: tenantAdminRole.id,
      scopeType: "company",
    },
    audit,
    db
  );

  return {
    tenantId: tenant.id,
    companyId: company.id,
    organizationId: organization.id,
    tenantRoleId: tenantAdminRole.id,
    userId: user.id,
    membershipId: membership.id,
  };
}

export async function seedDevWorkspaceProfile(
  profile: SeedProfile,
  fixture: WorkspaceFixture,
  db: AfendaDatabase
): Promise<SeedRunResult> {
  const platform = await seedPlatformCatalog(profile, db);
  const workspace = await seedDevWorkspace(profile, fixture, db);

  return {
    ...platform,
    workspace,
  };
}
