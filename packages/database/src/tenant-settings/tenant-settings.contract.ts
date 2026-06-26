import { z } from "zod";

/** Serializable notifications settings persisted for tenant_settings.notifications. */
export const tenantNotificationsSettingsSchema = z.object({
  browserItems: z.array(
    z.object({
      checked: z.boolean(),
      id: z.string().min(1).max(64),
      label: z.string().min(1).max(255),
    })
  ),
  daysOff: z.array(z.string().min(1).max(16)),
  dndEnabled: z.boolean(),
  fromTime: z.string().min(1).max(16),
  inboxItems: z.array(
    z.object({
      description: z.string().max(512),
      enabled: z.boolean(),
      id: z.string().min(1).max(64),
      label: z.string().min(1).max(255),
    })
  ),
  playSoundOnBlink: z.boolean(),
  sections: z.array(
    z.object({
      id: z.string().min(1).max(64),
      items: z.array(
        z.object({
          channels: z.object({
            app: z.boolean(),
            desktop: z.boolean(),
            email: z.boolean(),
          }),
          description: z.string().max(512),
          id: z.string().min(1).max(64),
          title: z.string().min(1).max(255),
        })
      ),
      title: z.string().min(1).max(255),
    })
  ),
  toTime: z.string().min(1).max(16),
});

/** Serializable auth branding settings persisted for tenant_settings.appearance. */
export const tenantAppearanceSettingsSchema = z.object({
  enabled: z.boolean(),
  headline: z.string().min(1).max(255),
  logoObjectId: z.string().uuid().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  productLabel: z.string().min(1).max(128),
  supportingText: z.string().max(1024),
});

/** Serializable workspace settings persisted for tenant_settings.workspace. */
export const tenantWorkspaceSettingsSchema = z.object({
  description: z.string().max(1024),
  slug: z.string().max(128),
  timezone: z.string().min(1).max(128),
  urlSuffix: z.string().max(255),
  workspaceName: z.string().min(1).max(255),
});

const tenantIntegrationAppSchema = z.object({
  connected: z.boolean(),
  description: z.string().max(512),
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(255),
  pricingLabel: z.string().max(64).optional(),
});

/** Social OAuth providers allowlisted per tenant (ARCH-AUTH-001 Slice 13c). */
export const TENANT_OAUTH_PROVIDER_IDS = ["google", "github"] as const;

export type TenantOAuthProviderId = (typeof TENANT_OAUTH_PROVIDER_IDS)[number];

/** Metadata key for env-backed OAuth client secret — never persist secret values. */
export const TENANT_OAUTH_CLIENT_SECRET_ENV_KEY = "clientSecretEnvKey" as const;

export const tenantOAuthProviderConfigSchema = z.object({
  clientId: z.string().max(255),
  [TENANT_OAUTH_CLIENT_SECRET_ENV_KEY]: z.string().min(1).max(128).optional(),
  displayName: z.string().min(1).max(255),
  enabled: z.boolean(),
});

export const tenantOAuthSettingsSchema = z.object({
  providers: z.object({
    google: tenantOAuthProviderConfigSchema,
    github: tenantOAuthProviderConfigSchema,
  }),
});

export type TenantOAuthProviderConfig = z.infer<
  typeof tenantOAuthProviderConfigSchema
>;
export type TenantOAuthSettings = z.infer<typeof tenantOAuthSettingsSchema>;

export function buildDefaultTenantOAuthProviderConfig(
  displayName: string
): TenantOAuthProviderConfig {
  return {
    clientId: "",
    displayName,
    enabled: false,
  };
}

export function buildDefaultTenantOAuthSettings(): TenantOAuthSettings {
  return {
    providers: {
      google: buildDefaultTenantOAuthProviderConfig("Google"),
      github: buildDefaultTenantOAuthProviderConfig("GitHub"),
    },
  };
}

function withDefaultOAuthProviders(value: unknown): unknown {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  const record = value as Record<string, unknown>;
  const oauth = record["oauth"];

  if (typeof oauth !== "object" || oauth === null) {
    return value;
  }

  const oauthRecord = oauth as Record<string, unknown>;
  const providers = oauthRecord["providers"];
  const defaultProviders = buildDefaultTenantOAuthSettings().providers;

  if (typeof providers !== "object" || providers === null) {
    return {
      ...record,
      oauth: {
        ...oauthRecord,
        providers: defaultProviders,
      },
    };
  }

  const providerRecord = providers as Record<string, unknown>;
  const mergedProviders = Object.fromEntries(
    TENANT_OAUTH_PROVIDER_IDS.map((providerId) => [
      providerId,
      {
        ...defaultProviders[providerId],
        ...(typeof providerRecord[providerId] === "object" &&
        providerRecord[providerId] !== null
          ? providerRecord[providerId]
          : {}),
      },
    ])
  );

  return {
    ...record,
    oauth: {
      ...oauthRecord,
      providers: mergedProviders,
    },
  };
}

/** Serializable integrations settings persisted for tenant_settings.integrations. */
export const tenantIntegrationsSettingsSchema = z.object({
  communication: z.object({
    apps: z.array(tenantIntegrationAppSchema),
  }),
  oauth: tenantOAuthSettingsSchema.default(buildDefaultTenantOAuthSettings()),
  planning: z.object({
    apps: z.array(tenantIntegrationAppSchema),
  }),
  tools: z.object({
    apps: z.array(tenantIntegrationAppSchema),
  }),
});

/** Serializable billing settings persisted for tenant_settings.billing. */
export const tenantBillingSettingsSchema = z.object({
  addOns: z.array(
    z.object({
      badgeLabel: z.string().max(64).optional(),
      description: z.string().max(512),
      enabled: z.boolean(),
      id: z.string().min(1).max(64),
      name: z.string().min(1).max(255),
      priceLabel: z.string().max(64),
    })
  ),
  autoPayEnabled: z.boolean(),
  customAmount: z.string().max(32),
  notificationEmail: z.string().max(320),
  selectedPreset: z.string().max(32).optional(),
  setAmount: z.string().max(32),
  spendEnabled: z.boolean(),
});

export type TenantNotificationsSettings = z.infer<
  typeof tenantNotificationsSettingsSchema
>;
export type TenantWorkspaceSettings = z.infer<
  typeof tenantWorkspaceSettingsSchema
>;
export type TenantBillingSettings = z.infer<typeof tenantBillingSettingsSchema>;
export type TenantAppearanceSettings = z.infer<
  typeof tenantAppearanceSettingsSchema
>;
export type TenantIntegrationsSettings = z.infer<
  typeof tenantIntegrationsSettingsSchema
>;

export type TenantSettingsSectionKey =
  | "appearance"
  | "billing"
  | "integrations"
  | "notifications"
  | "workspace";

export interface TenantSettingsRecord {
  readonly appearance: TenantAppearanceSettings | null;
  readonly billing: TenantBillingSettings | null;
  readonly id: string;
  readonly integrations: TenantIntegrationsSettings | null;
  readonly notifications: TenantNotificationsSettings | null;
  readonly tenantId: string;
  readonly workspace: TenantWorkspaceSettings | null;
}

export function buildDefaultTenantAppearanceSettings(input: {
  readonly productLabel: string;
}): TenantAppearanceSettings {
  return {
    enabled: false,
    headline: "Access that feels remembered.",
    logoObjectId: null,
    primaryColor: "#324038",
    productLabel: input.productLabel,
    supportingText:
      "The first controlled moment before every workspace, approval, and operating decision inside Afenda.",
  };
}

export function parseTenantNotificationsSettings(
  value: unknown
): TenantNotificationsSettings | null {
  const parsed = tenantNotificationsSettingsSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function parseTenantWorkspaceSettings(
  value: unknown
): TenantWorkspaceSettings | null {
  const parsed = tenantWorkspaceSettingsSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function parseTenantBillingSettings(
  value: unknown
): TenantBillingSettings | null {
  const parsed = tenantBillingSettingsSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function parseTenantIntegrationsSettings(
  value: unknown
): TenantIntegrationsSettings | null {
  const parsed = tenantIntegrationsSettingsSchema.safeParse(
    withDefaultOAuthProviders(value)
  );
  return parsed.success ? parsed.data : null;
}

export function parseTenantAppearanceSettings(
  value: unknown
): TenantAppearanceSettings | null {
  const parsed = tenantAppearanceSettingsSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
