import type { AfendaDatabase } from "../db.js";
import { PLATFORM_PERMISSION_CATALOG } from "./platform-permissions.catalog.js";
import { PLATFORM_POLICY_CATALOG } from "./platform-policies.catalog.js";
import { PLATFORM_ROLE_CATALOG } from "./platform-roles.catalog.js";
import { createSeedAuditBundle } from "./seed-context.js";
import {
  ensurePermission,
  ensurePolicy,
  ensureRole,
  ensureRolePermissionGrant,
  findPermissionIdByKey,
} from "./seed-ensure.js";
import type {
  SeedEnsureResult,
  SeedGrantResult,
  SeedProfile,
  SeedRunResult,
} from "./seed-types.js";

async function seedPlatformCatalog(
  profile: SeedProfile,
  db: AfendaDatabase
): Promise<SeedRunResult> {
  const audit = createSeedAuditBundle(profile);
  const permissionResults: SeedEnsureResult[] = [];
  const permissionIdByKey = new Map<string, string>();

  for (const entry of PLATFORM_PERMISSION_CATALOG) {
    const result = await ensurePermission(entry, audit, db);
    permissionResults.push(result);
    permissionIdByKey.set(entry.key, result.id);
  }

  const roleResults: SeedEnsureResult[] = [];
  const roleIdByKey = new Map<string, string>();

  for (const entry of PLATFORM_ROLE_CATALOG) {
    const result = await ensureRole(
      {
        tenantId: entry.tenantId,
        key: entry.key,
        name: entry.name,
        description: entry.description,
        scope: entry.scope,
      },
      audit,
      db
    );
    roleResults.push(result);
    roleIdByKey.set(entry.key, result.id);
  }

  const grantResults: SeedGrantResult[] = [];

  for (const role of PLATFORM_ROLE_CATALOG) {
    const roleId = roleIdByKey.get(role.key);

    if (!roleId) {
      throw new Error(`Platform role "${role.key}" was not seeded.`);
    }

    for (const permissionKey of role.permissionKeys) {
      const permissionId =
        permissionIdByKey.get(permissionKey) ??
        (await findPermissionIdByKey(permissionKey, db));

      if (!permissionId) {
        throw new Error(`Permission "${permissionKey}" was not seeded.`);
      }

      grantResults.push(
        await ensureRolePermissionGrant({
          audit,
          db,
          tenantId: role.tenantId,
          roleId,
          roleKey: role.key,
          permissionId,
          permissionKey,
          reason: `${profile} platform seed`,
        })
      );
    }
  }

  const policyResults: SeedEnsureResult[] = [];

  for (const entry of PLATFORM_POLICY_CATALOG) {
    policyResults.push(
      await ensurePolicy(
        {
          tenantId: entry.tenantId,
          key: entry.key,
          name: entry.name,
          description: entry.description,
          scope: entry.scope,
          effect: entry.effect,
          priority: entry.priority,
          condition: entry.condition,
        },
        audit,
        db
      )
    );
  }

  return {
    profile,
    correlationId: audit.correlationId,
    permissions: permissionResults,
    roles: roleResults,
    grants: grantResults,
    policies: policyResults,
  };
}

/** Idempotent platform baseline seed — permissions, roles, grants, policies. */
export function seedPlatform(db: AfendaDatabase): Promise<SeedRunResult> {
  return seedPlatformCatalog("platform", db);
}

/** Test profile uses the same platform baseline without workspace fixtures. */
export function seedTest(db: AfendaDatabase): Promise<SeedRunResult> {
  return seedPlatformCatalog("test", db);
}

export { seedPlatformCatalog };
