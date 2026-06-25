import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  describeSyncTenantSsoProviderSkipReason,
  syncTenantSsoProviderWithBetterAuth,
} from "../auth.sso-sync.js";

const getTenantSsoProviderByIdMock = vi.fn();
const getAuthMock = vi.fn();
const registerSSOProviderMock = vi.fn();

vi.mock("@afenda/database", () => ({
  TENANT_SSO_CLIENT_SECRET_ENV_KEY: "clientSecretEnvKey",
  getTenantSsoProviderById: (...args: unknown[]) =>
    getTenantSsoProviderByIdMock(...args),
  parseTenantSsoOidcMetadata: (value: unknown) => value,
}));

vi.mock("../auth.server.js", () => ({
  getAuth: (...args: unknown[]) => getAuthMock(...args),
}));

describe("auth.sso-sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    registerSSOProviderMock.mockResolvedValue(undefined);
    getAuthMock.mockReturnValue({
      api: {
        registerSSOProvider: registerSSOProviderMock,
      },
    });
  });

  it("skips sync when client secret env var is missing", async () => {
    const tenantId = randomUUID();
    const id = randomUUID();

    getTenantSsoProviderByIdMock.mockResolvedValue({
      enabled: true,
      protocol: "oidc",
      providerId: "okta-acme",
      issuer: "https://acme.okta.com",
      domain: "acme.example",
      metadata: {
        clientId: "client-123",
        clientSecretEnvKey: "OKTA_CLIENT_SECRET",
      },
    });

    const result = await syncTenantSsoProviderWithBetterAuth({
      headers: new Headers(),
      id,
      tenantId,
      env: {},
    });

    expect(result).toEqual({
      kind: "skipped",
      reason: "missing_client_secret",
    });
    expect(registerSSOProviderMock).not.toHaveBeenCalled();
  });

  it("syncs enabled OIDC provider when client secret is present", async () => {
    const tenantId = randomUUID();
    const id = randomUUID();

    getTenantSsoProviderByIdMock.mockResolvedValue({
      enabled: true,
      protocol: "oidc",
      providerId: "okta-acme",
      issuer: "https://acme.okta.com",
      domain: "acme.example",
      metadata: {
        clientId: "client-123",
        clientSecretEnvKey: "OKTA_CLIENT_SECRET",
      },
    });

    const result = await syncTenantSsoProviderWithBetterAuth({
      headers: new Headers(),
      id,
      tenantId,
      env: { OKTA_CLIENT_SECRET: "secret-value" },
    });

    expect(result).toEqual({ kind: "synced", providerId: "okta-acme" });
    expect(registerSSOProviderMock).toHaveBeenCalled();
  });

  it("describes missing client secret skip reason for admin surfaces", () => {
    expect(
      describeSyncTenantSsoProviderSkipReason("missing_client_secret")
    ).toContain("client secret environment variable");
  });
});
