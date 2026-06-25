import { describe, expect, it } from "vitest";
import {
  buildDefaultTenantOAuthSettings,
  TENANT_OAUTH_CLIENT_SECRET_ENV_KEY,
  TENANT_OAUTH_PROVIDER_IDS,
  tenantIntegrationsSettingsSchema,
  tenantOAuthProviderConfigSchema,
} from "../tenant-settings/tenant-settings.contract.js";

describe("tenant OAuth settings contract", () => {
  it("defines MVP provider ids google and microsoft", () => {
    expect(TENANT_OAUTH_PROVIDER_IDS).toEqual(["google", "microsoft"]);
  });

  it("accepts default OAuth settings with disabled providers", () => {
    const defaults = buildDefaultTenantOAuthSettings();

    expect(defaults.providers.google.enabled).toBe(false);
    expect(defaults.providers.microsoft.enabled).toBe(false);
    expect(
      tenantOAuthProviderConfigSchema.parse(defaults.providers.google)
    ).toEqual(defaults.providers.google);
  });

  it("accepts integrations payload with oauth allowlist section", () => {
    const parsed = tenantIntegrationsSettingsSchema.parse({
      communication: { apps: [] },
      oauth: {
        providers: {
          google: {
            clientId: "google-client",
            displayName: "Google",
            enabled: true,
            [TENANT_OAUTH_CLIENT_SECRET_ENV_KEY]:
              "AFENDA_OAUTH_GOOGLE_CLIENT_SECRET",
          },
          microsoft: {
            clientId: "",
            displayName: "Microsoft",
            enabled: false,
          },
        },
      },
      planning: { apps: [] },
      tools: { apps: [] },
    });

    expect(parsed.oauth.providers.google.enabled).toBe(true);
    expect(
      parsed.oauth.providers.google[TENANT_OAUTH_CLIENT_SECRET_ENV_KEY]
    ).toBe("AFENDA_OAUTH_GOOGLE_CLIENT_SECRET");
  });
});
