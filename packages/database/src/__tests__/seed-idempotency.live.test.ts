import { count, inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { type AfendaDbClient, createDbClient } from "../db.js";
import { hasDatabaseUrl } from "../env.js";
import { permissions } from "../schema/permission.schema.js";
import { policies } from "../schema/policy.schema.js";
import { roles } from "../schema/role.schema.js";
import { rolePermissions } from "../schema/role-permission.schema.js";
import { PLATFORM_PERMISSION_CATALOG } from "../seeds/platform-permissions.catalog.js";
import { PLATFORM_POLICY_CATALOG } from "../seeds/platform-policies.catalog.js";
import { PLATFORM_ROLE_CATALOG } from "../seeds/platform-roles.catalog.js";
import { seedPlatform } from "../seeds/seed-platform.js";
import type { SeedRunResult } from "../seeds/seed-types.js";
import { verifyPlatformSeed } from "../seeds/seed-verify.js";

const LIVE_DB_TEST_ENV = "AFENDA_LIVE_DB_TEST";
const LIVE_DB_TEST_CONFIRM = "yes";

function isLiveDatabaseTestEnabled(): boolean {
  return (
    process.env[LIVE_DB_TEST_ENV]?.trim().toLowerCase() ===
      LIVE_DB_TEST_CONFIRM && hasDatabaseUrl()
  );
}

function isSeedRunIdempotent(result: SeedRunResult): boolean {
  return (
    result.permissions.every((entry) => !entry.created) &&
    result.roles.every((entry) => !entry.created) &&
    result.policies.every((entry) => !entry.created) &&
    result.grants.every((entry) => !entry.created)
  );
}

describe.runIf(isLiveDatabaseTestEnabled())(
  "seed platform idempotency (live database)",
  () => {
    let client: AfendaDbClient;

    beforeAll(() => {
      client = createDbClient();
    });

    afterAll(async () => {
      await client.close();
    });

    async function countPlatformBaselineRows(): Promise<{
      grants: number;
      permissions: number;
      policies: number;
      roles: number;
    }> {
      const permissionKeys = PLATFORM_PERMISSION_CATALOG.map(
        (entry) => entry.key
      );
      const roleKeys = PLATFORM_ROLE_CATALOG.map((entry) => entry.key);
      const policyKeys = PLATFORM_POLICY_CATALOG.map((entry) => entry.key);

      const [[permissionRow], [roleRow], [policyRow], [grantRow]] =
        await Promise.all([
          client.db
            .select({ value: count() })
            .from(permissions)
            .where(inArray(permissions.key, permissionKeys)),
          client.db
            .select({ value: count() })
            .from(roles)
            .where(inArray(roles.key, roleKeys)),
          client.db
            .select({ value: count() })
            .from(policies)
            .where(inArray(policies.key, policyKeys)),
          client.db.select({ value: count() }).from(rolePermissions),
        ]);

      return {
        permissions: permissionRow?.value ?? 0,
        roles: roleRow?.value ?? 0,
        policies: policyRow?.value ?? 0,
        grants: grantRow?.value ?? 0,
      };
    }

    it("seedPlatform is idempotent across consecutive runs", async () => {
      const countsBefore = await countPlatformBaselineRows();

      const firstRun = await seedPlatform(client.db);
      const countsAfterFirst = await countPlatformBaselineRows();
      const secondRun = await seedPlatform(client.db);
      const countsAfterSecond = await countPlatformBaselineRows();

      expect(firstRun.profile).toBe("platform");
      expect(secondRun.profile).toBe("platform");
      expect(isSeedRunIdempotent(secondRun)).toBe(true);

      expect(countsAfterFirst.permissions).toBeGreaterThanOrEqual(
        countsBefore.permissions
      );
      expect(countsAfterFirst.roles).toBeGreaterThanOrEqual(countsBefore.roles);
      expect(countsAfterFirst.policies).toBeGreaterThanOrEqual(
        countsBefore.policies
      );
      expect(countsAfterFirst.grants).toBeGreaterThanOrEqual(
        countsBefore.grants
      );

      expect(countsAfterSecond).toEqual(countsAfterFirst);

      const verification = await verifyPlatformSeed(client.db, "platform");
      expect(verification.ok).toBe(true);
      expect(verification.issues).toEqual([]);
    });
  }
);
