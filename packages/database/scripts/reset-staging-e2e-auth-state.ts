import { eq } from "drizzle-orm";

import { resetAllDbClients } from "../src/auth-db.js";
import { updateCompany } from "../src/company/company.service.js";
import { createDbClient } from "../src/db.js";
import { companies } from "../src/schema/company.schema.js";
import { tenants } from "../src/schema/tenant.schema.js";
import { updateTenant } from "../src/tenant/tenant.service.js";
import { mergeTenantOAuthProviderSettings } from "../src/tenant-settings/tenant-settings.service.js";
import { loadDatabaseEnv } from "./load-env.js";

loadDatabaseEnv();

const defaultTenantSlug =
  process.env["AFENDA_E2E_DEFAULT_TENANT_SLUG"]?.trim() || "dev-local";

const client = createDbClient();
const db = client.db;

try {
  const [tenant] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.slug, defaultTenantSlug))
    .limit(1);

  if (tenant) {
    const correlationId = `e2e-staging-reset-${Date.now()}`;
    const audit = {
      actorType: "system" as const,
      actorUserId: null,
      correlationId,
      source: "system" as const,
    };

    await updateTenant(
      tenant.id,
      {
        audit,
        mfaRequired: false,
      },
      db
    );

    const [company] = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.tenantId, tenant.id))
      .limit(1);

    if (company) {
      await updateCompany(
        company.id,
        {
          audit,
          mfaRequiredOverride: null,
        },
        db
      );
    }

    await mergeTenantOAuthProviderSettings(
      {
        audit,
        patch: { enabled: true },
        providerId: "github",
        tenantId: tenant.id,
      },
      db
    );

    console.log(
      JSON.stringify({
        companyId: company?.id ?? null,
        githubOAuthEnabled: true,
        mfaRequired: false,
        tenantId: tenant.id,
        tenantSlug: defaultTenantSlug,
      })
    );
  } else {
    console.error(
      `reset-staging-e2e-auth-state: tenant slug "${defaultTenantSlug}" not found`
    );
    process.exitCode = 1;
  }
} catch (error) {
  console.error("reset-staging-e2e-auth-state failed");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.close();
  resetAllDbClients();
}
