import { randomUUID } from "node:crypto";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const resolveActionOperatingContextMock = vi.hoisted(() => vi.fn());
const guardSystemAdminSectionMock = vi.hoisted(() => vi.fn());
const recordActionAuditMock = vi.hoisted(() => vi.fn());
const persistAuthAuditEventMock = vi.hoisted(() => vi.fn());
const syncTenantSsoProviderWithBetterAuthMock = vi.hoisted(() => vi.fn());
const describeSyncTenantSsoProviderSkipReasonMock = vi.hoisted(() => vi.fn());
const upsertTenantSsoOidcProviderMock = vi.hoisted(() => vi.fn());
const setTenantSsoProviderEnabledMock = vi.hoisted(() => vi.fn());

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

  return {
    upsertTenantSsoOidcProviderInputSchema,
    setTenantSsoProviderEnabled: setTenantSsoProviderEnabledMock,
    upsertTenantSsoOidcProvider: upsertTenantSsoOidcProviderMock,
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
});
