import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { type AfendaDbClient, createDbClient } from "../db.js";
import { loadTenantEntitlementBundle } from "../entitlement/entitlement-load.service.js";
import { provisionTenantEntitlements } from "../entitlement/entitlement-provision.service.js";
import { loadPlatformRolloutBundle } from "../entitlement/rollout-load.service.js";
import { syncPlatformRolloutCatalog } from "../entitlement/rollout-sync.service.js";
import { hasDatabaseUrl } from "../env.js";
import { tenants } from "../schema/tenant.schema.js";
import { insertTenant } from "../tenant/tenant.service.js";

const LIVE_DB_TEST_ENV = "AFENDA_LIVE_DB_TEST";
const LIVE_DB_TEST_CONFIRM = "yes";

function isLiveDatabaseTestEnabled(): boolean {
  return (
    process.env[LIVE_DB_TEST_ENV]?.trim().toLowerCase() ===
      LIVE_DB_TEST_CONFIRM && hasDatabaseUrl()
  );
}

describe.runIf(isLiveDatabaseTestEnabled())(
  "entitlement provision and rollout (live database)",
  () => {
    let client: AfendaDbClient;
    let tenantId: string;

    beforeAll(async () => {
      client = createDbClient();
      await syncPlatformRolloutCatalog(client.db);

      const slug = `live-entitlement-${Date.now()}`;
      const created = await insertTenant(
        {
          slug,
          name: "Live Entitlement Test Tenant",
          audit: {
            actorType: "system",
            correlationId: `corr_live_entitlement_${Date.now()}`,
            source: "system",
          },
        },
        client.db
      );

      tenantId = created.id;
    });

    afterAll(async () => {
      if (tenantId) {
        await client.db.delete(tenants).where(eq(tenants.id, tenantId));
      }

      await client.close();
    });

    it("provisions and reloads tenant entitlement grants", async () => {
      const correlationId = `corr_provision_${Date.now()}`;

      const provisioned = await provisionTenantEntitlements(
        {
          tenantId,
          planTemplateId: "pro",
          correlationId,
          audit: {
            actorType: "system",
            correlationId,
            source: "system",
          },
        },
        client.db
      );

      expect(provisioned).toMatchObject({
        tenantId,
        planTemplateId: "pro",
        entitlementCount: 5,
        usageLimitCount: 8,
      });

      const bundle = await loadTenantEntitlementBundle(tenantId, client.db);

      expect(bundle.planTemplateId).toBe("pro");
      expect(bundle.entitlements).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "module.accounting.enabled",
            enabled: true,
          }),
          expect.objectContaining({
            key: "feature.e_invoice.enabled",
            enabled: true,
          }),
        ])
      );
      expect(bundle.usageLimits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: "users.max", maximum: 50 }),
        ])
      );
    });

    it("loads platform rollout flags and kill switches from Postgres", async () => {
      const rollout = await loadPlatformRolloutBundle(client.db);

      expect(rollout.featureFlags.length).toBeGreaterThan(0);
      expect(rollout.killSwitches.length).toBeGreaterThan(0);
      expect(rollout.featureFlags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: "e_invoice", enabled: true }),
        ])
      );
    });
  }
);
