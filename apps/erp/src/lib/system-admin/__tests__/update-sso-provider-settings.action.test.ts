import { randomUUID } from "node:crypto";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const resolveActionOperatingContextMock = vi.hoisted(() => vi.fn());
const guardSystemAdminSectionMock = vi.hoisted(() => vi.fn());
const recordActionAuditMock = vi.hoisted(() => vi.fn());
const persistAuthAuditEventMock = vi.hoisted(() => vi.fn());
const syncTenantSsoProviderWithBetterAuthMock = vi.hoisted(() => vi.fn());
const describeSyncTenantSsoProviderSkipReasonMock = vi.hoisted(() => vi.fn());
const upsertTenantSsoOidcProviderMock = vi.hoisted(() => vi.fn());
const upsertTenantSsoSamlProviderMock = vi.hoisted(() => vi.fn());
const setTenantSsoProviderEnabledMock = vi.hoisted(() => vi.fn());
const rotateTenantSsoOidcClientSecretEnvKeyMock = vi.hoisted(() => vi.fn());
const rotateTenantSsoSamlCertificateMock = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/server-actions/resolve-action-operating-context.server", () => ({
  resolveActionOperatingContext: resolveActionOperatingContextMock,
}));

vi.mock("@/lib/system-admin/guard-system-admin-section.server", () => ({
  guardSystemAdminSection: guardSystemAdminSectionMock,
}));

vi.mock("@/lib/server-actions/record-action-audit", () => ({
  recordActionAudit: recordActionAuditMock,
}));

vi.mock("@afenda/auth", () => ({
  AUTH_EVENT: {
    ssoProviderConfigured: "auth.sso.provider_configured",
  },
  describeSyncTenantSsoProviderSkipReason:
    describeSyncTenantSsoProviderSkipReasonMock,
  persistAuthAuditEvent: persistAuthAuditEventMock,
  syncTenantSsoProviderWithBetterAuth: syncTenantSsoProviderWithBetterAuthMock,
}));

vi.mock("@afenda/database", async () => {
  const { z } = await import("zod");

  const tenantSsoOidcMetadataSchema = z.object({
    authorizationEndpoint: z.string().url().optional(),
    clientId: z.string().min(1).max(255),
    clientSecretEnvKey: z.string().min(1).max(128).optional(),
    discoveryEndpoint: z.string().url().optional(),
    jwksEndpoint: z.string().url().optional(),
    pkce: z.boolean().optional(),
    scopes: z.array(z.string().min(1).max(64)).optional(),
    tokenEndpoint: z.string().url().optional(),
  });

  const upsertTenantSsoOidcProviderInputSchema = z.object({
    displayName: z.string().min(1).max(255),
    domain: z.string().min(1).max(255),
    enabled: z.boolean().optional(),
    issuer: z.string().url(),
    metadata: tenantSsoOidcMetadataSchema,
    providerId: z.string().min(1).max(128),
    tenantId: z.string().uuid(),
  });

  const tenantSsoSamlMetadataSchema = z.object({
    callbackUrl: z.string().url().optional(),
    cert: z.string().min(1),
    entryPoint: z.string().url(),
    idpMetadataXml: z.string().max(65_536).optional(),
  });

  const upsertTenantSsoSamlProviderInputSchema = z.object({
    displayName: z.string().min(1).max(255),
    domain: z.string().min(1).max(255),
    enabled: z.boolean().optional(),
    issuer: z.string().url(),
    metadata: tenantSsoSamlMetadataSchema,
    providerId: z.string().min(1).max(128),
    tenantId: z.string().uuid(),
  });

  return {
    upsertTenantSsoOidcProviderInputSchema,
    upsertTenantSsoSamlProviderInputSchema,
    setTenantSsoProviderEnabled: setTenantSsoProviderEnabledMock,
    upsertTenantSsoOidcProvider: upsertTenantSsoOidcProviderMock,
    upsertTenantSsoSamlProvider: upsertTenantSsoSamlProviderMock,
    rotateTenantSsoOidcClientSecretEnvKey:
      rotateTenantSsoOidcClientSecretEnvKeyMock,
    rotateTenantSsoSamlCertificate: rotateTenantSsoSamlCertificateMock,
  };
});

const tenantId = randomUUID();
const actorUserId = randomUUID();

let updateSsoProviderSettingsAction: typeof import("../update-sso-provider-settings.action.js").updateSsoProviderSettingsAction;

describe("updateSsoProviderSettingsAction", () => {
  beforeAll(async () => {
    ({ updateSsoProviderSettingsAction } = await import(
      "../update-sso-provider-settings.action.js"
    ));
  }, 30_000);

  beforeEach(() => {
    vi.clearAllMocks();
    resolveActionOperatingContextMock.mockResolvedValue({
      ok: true,
      operatingContext: {
        actor: { userId: actorUserId },
        correlationId: "corr-sso-1",
        tenant: { tenantId },
      },
      session: { user: { authUserId: "auth-user-1" } },
    });
    guardSystemAdminSectionMock.mockResolvedValue({ kind: "allowed" });
    describeSyncTenantSsoProviderSkipReasonMock.mockReturnValue(
      "SSO provider saved, but Better Auth sync was skipped because the client secret environment variable is missing or empty."
    );
  });

  it("upserts an OIDC provider and emits audit evidence", async () => {
    upsertTenantSsoOidcProviderMock.mockResolvedValue({
      id: randomUUID(),
      providerId: "okta-acme",
      enabled: true,
    });
    syncTenantSsoProviderWithBetterAuthMock.mockResolvedValue({
      kind: "synced",
      providerId: "okta-acme",
    });

    const formData = new FormData();
    formData.set("mode", "upsert");
    formData.set(
      "payload",
      JSON.stringify({
        providerId: "okta-acme",
        displayName: "Okta ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: { clientId: "client-123" },
      })
    );

    const result = await updateSsoProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(true);
    expect(upsertTenantSsoOidcProviderMock).toHaveBeenCalled();
    expect(syncTenantSsoProviderWithBetterAuthMock).toHaveBeenCalled();
    expect(persistAuthAuditEventMock).toHaveBeenCalled();
    expect(recordActionAuditMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "system_admin.settings.integrations.sso.update",
        result: "success",
      })
    );
  });

  it("upserts a SAML provider and syncs with Better Auth", async () => {
    upsertTenantSsoSamlProviderMock.mockResolvedValue({
      id: randomUUID(),
      providerId: "okta-saml-acme",
      enabled: true,
    });
    syncTenantSsoProviderWithBetterAuthMock.mockResolvedValue({
      kind: "synced",
      providerId: "okta-saml-acme",
    });

    const formData = new FormData();
    formData.set("mode", "upsert");
    formData.set(
      "payload",
      JSON.stringify({
        protocol: "saml",
        providerId: "okta-saml-acme",
        displayName: "Okta SAML ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: {
          entryPoint: "https://acme.okta.com/sso/saml",
          cert: "-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----",
        },
      })
    );

    const result = await updateSsoProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(true);
    expect(upsertTenantSsoSamlProviderMock).toHaveBeenCalled();
    expect(upsertTenantSsoOidcProviderMock).not.toHaveBeenCalled();
    expect(syncTenantSsoProviderWithBetterAuthMock).toHaveBeenCalled();
  });

  it("surfaces sync skip reason when client secret env var is missing", async () => {
    upsertTenantSsoOidcProviderMock.mockResolvedValue({
      id: randomUUID(),
      providerId: "okta-acme",
      enabled: true,
    });
    syncTenantSsoProviderWithBetterAuthMock.mockResolvedValue({
      kind: "skipped",
      reason: "missing_client_secret",
    });

    const formData = new FormData();
    formData.set("mode", "upsert");
    formData.set(
      "payload",
      JSON.stringify({
        providerId: "okta-acme",
        displayName: "Okta ACME",
        domain: "acme.example",
        issuer: "https://acme.okta.com",
        enabled: true,
        metadata: { clientId: "client-123" },
      })
    );

    const result = await updateSsoProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(true);
    if (result?.ok) {
      expect(result.data.syncNotice).toContain(
        "client secret environment variable"
      );
    }
  });

  it("toggles provider enabled state", async () => {
    const providerId = randomUUID();
    setTenantSsoProviderEnabledMock.mockResolvedValue({
      id: providerId,
      providerId: "okta-acme",
      enabled: false,
    });

    const formData = new FormData();
    formData.set("mode", "toggle");
    formData.set("id", providerId);
    formData.set("enabled", "false");

    const result = await updateSsoProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(true);
    expect(setTenantSsoProviderEnabledMock).toHaveBeenCalledWith({
      id: providerId,
      tenantId,
      enabled: false,
    });
  });

  it("rejects invalid upsert payload JSON safely", async () => {
    const formData = new FormData();
    formData.set("mode", "upsert");
    formData.set("payload", "{not-json");

    const result = await updateSsoProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(false);
  });

  it("rotates OIDC client secret env key and syncs when enabled", async () => {
    const providerId = randomUUID();
    rotateTenantSsoOidcClientSecretEnvKeyMock.mockResolvedValue({
      id: providerId,
      providerId: "okta-acme",
      enabled: true,
    });
    syncTenantSsoProviderWithBetterAuthMock.mockResolvedValue({
      kind: "synced",
      providerId: "okta-acme",
    });

    const formData = new FormData();
    formData.set("mode", "rotate");
    formData.set(
      "payload",
      JSON.stringify({
        protocol: "oidc",
        id: providerId,
        clientSecretEnvKey: "ACME_OKTA_CLIENT_SECRET",
      })
    );

    const result = await updateSsoProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(true);
    expect(rotateTenantSsoOidcClientSecretEnvKeyMock).toHaveBeenCalledWith({
      clientSecretEnvKey: "ACME_OKTA_CLIENT_SECRET",
      id: providerId,
      tenantId,
    });
    expect(syncTenantSsoProviderWithBetterAuthMock).toHaveBeenCalled();
    expect(persistAuthAuditEventMock).toHaveBeenCalled();
  });

  it("rotates SAML certificate metadata", async () => {
    const providerId = randomUUID();
    rotateTenantSsoSamlCertificateMock.mockResolvedValue({
      id: providerId,
      providerId: "okta-saml-acme",
      enabled: false,
    });

    const formData = new FormData();
    formData.set("mode", "rotate");
    formData.set(
      "payload",
      JSON.stringify({
        protocol: "saml",
        id: providerId,
        cert: "-----BEGIN CERTIFICATE-----\nROTATED\n-----END CERTIFICATE-----",
      })
    );

    const result = await updateSsoProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(true);
    expect(rotateTenantSsoSamlCertificateMock).toHaveBeenCalledWith({
      cert: "-----BEGIN CERTIFICATE-----\nROTATED\n-----END CERTIFICATE-----",
      id: providerId,
      tenantId,
    });
    expect(rotateTenantSsoOidcClientSecretEnvKeyMock).not.toHaveBeenCalled();
    expect(syncTenantSsoProviderWithBetterAuthMock).not.toHaveBeenCalled();
  });
});
