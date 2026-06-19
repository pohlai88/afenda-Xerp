import { count, eq, inArray, isNull } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { permissions } from "../schema/permission.schema.js";
import { policies } from "../schema/policy.schema.js";
import { roles } from "../schema/role.schema.js";
import { rolePermissions } from "../schema/role-permission.schema.js";
import { PLATFORM_PERMISSION_CATALOG } from "./platform-permissions.catalog.js";
import { PLATFORM_POLICY_CATALOG } from "./platform-policies.catalog.js";
import { PLATFORM_ROLE_CATALOG } from "./platform-roles.catalog.js";
import { findRoleIdByKey } from "./seed-ensure.js";
import type { SeedProfile, SeedVerificationResult } from "./seed-types.js";

async function countPermissionsByKeys(
  keys: readonly string[],
  db: AfendaDatabase
): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(permissions)
    .where(inArray(permissions.key, [...keys]));

  return row?.value ?? 0;
}

async function countPlatformRoles(db: AfendaDatabase): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(roles)
    .where(isNull(roles.tenantId));

  return row?.value ?? 0;
}

async function countPlatformPolicies(db: AfendaDatabase): Promise<number> {
  const keys = PLATFORM_POLICY_CATALOG.map((entry) => entry.key);
  const [row] = await db
    .select({ value: count() })
    .from(policies)
    .where(inArray(policies.key, keys));

  return row?.value ?? 0;
}

async function countRoleGrants(
  roleId: string,
  expectedGrantCount: number,
  db: AfendaDatabase
): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(rolePermissions)
    .where(eq(rolePermissions.roleId, roleId));

  const actual = row?.value ?? 0;
  return actual >= expectedGrantCount ? expectedGrantCount : actual;
}

/** Verifies platform baseline seed state without mutating data. */
export async function verifyPlatformSeed(
  db: AfendaDatabase,
  profile: SeedProfile = "platform"
): Promise<SeedVerificationResult> {
  const issues: { code: string; message: string }[] = [];
  const expectedPermissionCount = PLATFORM_PERMISSION_CATALOG.length;
  const permissionCount = await countPermissionsByKeys(
    PLATFORM_PERMISSION_CATALOG.map((entry) => entry.key),
    db
  );

  if (permissionCount < expectedPermissionCount) {
    issues.push({
      code: "permissions.missing",
      message: `Expected at least ${expectedPermissionCount} platform permissions, found ${permissionCount}.`,
    });
  }

  const platformRoleCount = await countPlatformRoles(db);

  if (platformRoleCount < PLATFORM_ROLE_CATALOG.length) {
    issues.push({
      code: "roles.missing",
      message: `Expected at least ${PLATFORM_ROLE_CATALOG.length} platform roles, found ${platformRoleCount}.`,
    });
  }

  for (const role of PLATFORM_ROLE_CATALOG) {
    const roleId = await findRoleIdByKey({ key: role.key, tenantId: null }, db);

    if (!roleId) {
      issues.push({
        code: "role.missing",
        message: `Platform role "${role.key}" is missing.`,
      });
      continue;
    }

    const grantCount = await countRoleGrants(
      roleId,
      role.permissionKeys.length,
      db
    );

    if (grantCount < role.permissionKeys.length) {
      issues.push({
        code: "grants.missing",
        message: `Role "${role.key}" is missing permission grants (${grantCount}/${role.permissionKeys.length}).`,
      });
    }
  }

  const policyCount = await countPlatformPolicies(db);

  if (policyCount < PLATFORM_POLICY_CATALOG.length) {
    issues.push({
      code: "policies.missing",
      message: `Expected at least ${PLATFORM_POLICY_CATALOG.length} platform policies, found ${policyCount}.`,
    });
  }

  return {
    profile,
    ok: issues.length === 0,
    issues,
  };
}
