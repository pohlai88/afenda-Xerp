import {
  type AfendaDatabase,
  findTenantBySlug,
  mergeTenantOAuthProviderSettings,
  upsertTenantSettingsSection,
} from "@afenda/database";

import {
  AFENDA_OAUTH_GITHUB_CLIENT_ID_ENV,
  AFENDA_OAUTH_GOOGLE_CLIENT_ID_ENV,
} from "../auth.env.js";

/** Aligned with `packages/database/src/seeds/workspace-fixtures.ts`. */
export const DEV_BOOTSTRAP_TENANT_SLUG = "dev-local" as const;

const DEV_BOOTSTRAP_AUDIT = {
  actorType: "system",
  actorUserId: null,
  correlationId: "dev-tenant-sign-in-presentation",
  source: "system",
} as const;

function isPlatformOAuthProviderConfigured(
  env: NodeJS.ProcessEnv,
  providerId: "google" | "github"
): boolean {
  const envKey =
    providerId === "google"
      ? AFENDA_OAUTH_GOOGLE_CLIENT_ID_ENV
      : AFENDA_OAUTH_GITHUB_CLIENT_ID_ENV;

  return Boolean(env[envKey]?.trim());
}

/** Enables dev-local tenant OAuth + appearance so configured platform auth materializes on sign-in. */
export async function ensureDevTenantSignInPresentation(
  db: AfendaDatabase,
  env: NodeJS.ProcessEnv = process.env
): Promise<{
  readonly tenantSlug: string;
  readonly oauthEnabled: readonly string[];
}> {
  const tenant = await findTenantBySlug(DEV_BOOTSTRAP_TENANT_SLUG, db);

  if (tenant === null || tenant.status !== "active") {
    throw new Error(
      `Dev tenant "${DEV_BOOTSTRAP_TENANT_SLUG}" was not found. Run pnpm db:bootstrap:local before auth:bootstrap:dev.`
    );
  }

  const oauthEnabled: string[] = [];

  for (const providerId of ["google", "github"] as const) {
    if (!isPlatformOAuthProviderConfigured(env, providerId)) {
      continue;
    }

    await mergeTenantOAuthProviderSettings(
      {
        audit: DEV_BOOTSTRAP_AUDIT,
        patch: { enabled: true },
        providerId,
        tenantId: tenant.id,
      },
      db
    );
    oauthEnabled.push(providerId);
  }

  await upsertTenantSettingsSection(
    {
      audit: DEV_BOOTSTRAP_AUDIT,
      section: "appearance",
      tenantId: tenant.id,
      value: {
        enabled: true,
        headline: "Access that feels remembered.",
        logoObjectId: null,
        primaryColor: "#324038",
        productLabel: "Afenda ERP",
        supportingText:
          "The first controlled moment before every workspace, approval, and operating decision inside Afenda.",
      },
    },
    db
  );

  return { oauthEnabled, tenantSlug: DEV_BOOTSTRAP_TENANT_SLUG };
}
