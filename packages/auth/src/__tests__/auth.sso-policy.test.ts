import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_EVENT } from "../auth.contract.js";
import {
  AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX,
  AFENDA_AUTH_SSO_SAML_CALLBACK_PREFIX,
  AuthSsoInvitationRejectedError,
  assertSsoSignUpInvitationAllowed,
  createAfendaSsoPluginOptions,
  isAfendaAuthSsoCallbackPath,
} from "../auth.sso-policy.js";

const capturedAuditEvents: Array<{ event: string; result: string }> = [];

vi.mock("../auth.audit.js", () => ({
  persistAuthAuditEvent: (record: { event: string; result: string }) => {
    capturedAuditEvents.push(record);
    return Promise.resolve();
  },
}));

vi.mock("../auth.invitation.js", () => ({
  isAuthInvitationGateEnabled: (env: NodeJS.ProcessEnv) =>
    env["AFENDA_AUTH_INVITATION_GATE"] === "enabled",
}));

vi.mock("@afenda/database", () => ({
  findPendingMemberInvitationForEmail: vi.fn(),
  getEnabledTenantSsoProviderForTenantDomain: vi.fn(),
  getTenantSsoProviderByProviderId: vi.fn(),
  resolveTenantIdFromSsoEmailDomain: vi.fn(),
}));

import {
  findPendingMemberInvitationForEmail,
  getEnabledTenantSsoProviderForTenantDomain,
  getTenantSsoProviderByProviderId,
  resolveTenantIdFromSsoEmailDomain,
} from "@afenda/database";

describe("auth.sso-policy", () => {
  beforeEach(() => {
    capturedAuditEvents.length = 0;
    vi.mocked(findPendingMemberInvitationForEmail).mockReset();
    vi.mocked(getEnabledTenantSsoProviderForTenantDomain).mockReset();
    vi.mocked(getTenantSsoProviderByProviderId).mockReset();
    vi.mocked(resolveTenantIdFromSsoEmailDomain).mockReset();
  });

  it("recognizes Better Auth SSO callback path prefixes", () => {
    expect(
      isAfendaAuthSsoCallbackPath(`${AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX}okta`)
    ).toBe(true);
    expect(
      isAfendaAuthSsoCallbackPath(
        `${AFENDA_AUTH_SSO_SAML_CALLBACK_PREFIX}saml-provider`
      )
    ).toBe(true);
    expect(isAfendaAuthSsoCallbackPath("/sign-in/email")).toBe(false);
  });

  it("allows SSO sign-up when invitation gate is disabled", async () => {
    await expect(
      assertSsoSignUpInvitationAllowed({
        email: "user@example.com",
        env: { AFENDA_AUTH_INVITATION_GATE: "disabled" },
      })
    ).resolves.toBeUndefined();
  });

  it("blocks SSO sign-up without tenant-scoped IdP when gate is enabled", async () => {
    vi.mocked(resolveTenantIdFromSsoEmailDomain).mockResolvedValue(null);

    await expect(
      assertSsoSignUpInvitationAllowed({
        email: "user@example.com",
        env: { AFENDA_AUTH_INVITATION_GATE: "enabled" },
      })
    ).rejects.toBeInstanceOf(AuthSsoInvitationRejectedError);

    expect(capturedAuditEvents).toContainEqual(
      expect.objectContaining({
        event: AUTH_EVENT.ssoSignInFailed,
        result: "denied",
      })
    );
  });

  it("checks pending invitation within resolved tenant scope", async () => {
    const tenantId = randomUUID();
    vi.mocked(resolveTenantIdFromSsoEmailDomain).mockResolvedValue(tenantId);
    vi.mocked(findPendingMemberInvitationForEmail).mockResolvedValue(null);

    await expect(
      assertSsoSignUpInvitationAllowed({
        email: "user@acme.example",
        env: { AFENDA_AUTH_INVITATION_GATE: "enabled" },
      })
    ).rejects.toBeInstanceOf(AuthSsoInvitationRejectedError);

    expect(findPendingMemberInvitationForEmail).toHaveBeenCalledWith({
      email: "user@acme.example",
      tenantId,
    });
  });

  it("resolves tenant from SSO provider id during provisioning", async () => {
    const tenantId = randomUUID();
    vi.mocked(getTenantSsoProviderByProviderId).mockResolvedValue({
      displayName: "Okta ACME",
      domain: "acme.example",
      enabled: true,
      id: randomUUID(),
      issuer: "https://acme.okta.com",
      metadata: { clientId: "client-123" },
      protocol: "oidc",
      providerId: "okta-acme",
      tenantId,
    });
    vi.mocked(findPendingMemberInvitationForEmail).mockResolvedValue({
      email: "user@acme.example",
      expiresAt: Date.now() + 60_000,
      invitationId: randomUUID(),
      tenantId,
      token: "invite-token",
    });

    await expect(
      assertSsoSignUpInvitationAllowed({
        email: "user@acme.example",
        env: { AFENDA_AUTH_INVITATION_GATE: "enabled" },
        ssoProviderId: "okta-acme",
      })
    ).resolves.toBeUndefined();

    expect(getTenantSsoProviderByProviderId).toHaveBeenCalledWith({
      providerId: "okta-acme",
    });
  });

  it("validates explicit tenant id against tenant-scoped domain lookup", async () => {
    const tenantId = randomUUID();
    vi.mocked(getEnabledTenantSsoProviderForTenantDomain).mockResolvedValue({
      displayName: "Okta ACME",
      domain: "acme.example",
      enabled: true,
      id: randomUUID(),
      issuer: "https://acme.okta.com",
      metadata: { clientId: "client-123" },
      protocol: "oidc",
      providerId: "okta-acme",
      tenantId,
    });
    vi.mocked(findPendingMemberInvitationForEmail).mockResolvedValue({
      email: "user@acme.example",
      expiresAt: Date.now() + 60_000,
      invitationId: randomUUID(),
      tenantId,
      token: "invite-token",
    });

    await expect(
      assertSsoSignUpInvitationAllowed({
        email: "user@acme.example",
        env: { AFENDA_AUTH_INVITATION_GATE: "enabled" },
        tenantId,
      })
    ).resolves.toBeUndefined();

    expect(getEnabledTenantSsoProviderForTenantDomain).toHaveBeenCalledWith({
      domain: "acme.example",
      tenantId,
    });
  });

  it("exposes invitation-gated SSO plugin options", () => {
    const options = createAfendaSsoPluginOptions({
      AFENDA_AUTH_INVITATION_GATE: "enabled",
    });

    expect(options.disableImplicitSignUp).toBe(true);
    expect(typeof options.provisionUser).toBe("function");
  });
});
