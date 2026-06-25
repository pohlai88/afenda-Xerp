import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_EVENT } from "../auth.contract.js";
import {
  AFENDA_AUTH_OAUTH_CALLBACK_PREFIX,
  AuthOAuthInvitationRejectedError,
  assertOAuthSignUpInvitationAllowed,
  createAfendaOAuthSocialProviderOptions,
  isAfendaAuthOAuthCallbackPath,
  readOAuthProviderIdFromCallbackPath,
} from "../auth.oauth-policy.js";

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
  getTenantOAuthProviderConfig: vi.fn(),
}));

import {
  findPendingMemberInvitationForEmail,
  getTenantOAuthProviderConfig,
} from "@afenda/database";

describe("auth.oauth-policy", () => {
  beforeEach(() => {
    capturedAuditEvents.length = 0;
    vi.mocked(findPendingMemberInvitationForEmail).mockReset();
    vi.mocked(getTenantOAuthProviderConfig).mockReset();
  });

  it("recognizes Better Auth OAuth callback path prefixes", () => {
    expect(
      isAfendaAuthOAuthCallbackPath(
        `${AFENDA_AUTH_OAUTH_CALLBACK_PREFIX}google`
      )
    ).toBe(true);
    expect(
      isAfendaAuthOAuthCallbackPath(
        `${AFENDA_AUTH_OAUTH_CALLBACK_PREFIX}microsoft`
      )
    ).toBe(true);
    expect(isAfendaAuthOAuthCallbackPath("/sign-in/email")).toBe(false);
  });

  it("reads provider id from OAuth callback path", () => {
    expect(
      readOAuthProviderIdFromCallbackPath(
        `${AFENDA_AUTH_OAUTH_CALLBACK_PREFIX}google`
      )
    ).toBe("google");
    expect(
      readOAuthProviderIdFromCallbackPath(
        `${AFENDA_AUTH_OAUTH_CALLBACK_PREFIX}unknown`
      )
    ).toBeUndefined();
  });

  it("allows OAuth sign-up when invitation gate is disabled", async () => {
    await expect(
      assertOAuthSignUpInvitationAllowed({
        email: "user@example.com",
        env: { AFENDA_AUTH_INVITATION_GATE: "disabled" },
        providerId: "google",
      })
    ).resolves.toBeUndefined();
  });

  it("blocks OAuth sign-up without pending invitation and enabled provider", async () => {
    vi.mocked(findPendingMemberInvitationForEmail).mockResolvedValue(null);

    await expect(
      assertOAuthSignUpInvitationAllowed({
        email: "user@example.com",
        env: { AFENDA_AUTH_INVITATION_GATE: "enabled" },
        providerId: "google",
      })
    ).rejects.toBeInstanceOf(AuthOAuthInvitationRejectedError);

    expect(capturedAuditEvents).toContainEqual(
      expect.objectContaining({
        event: AUTH_EVENT.oauthSignInFailed,
        result: "denied",
      })
    );
  });

  it("blocks OAuth sign-up when tenant provider is disabled", async () => {
    const tenantId = randomUUID();
    vi.mocked(findPendingMemberInvitationForEmail).mockResolvedValue({
      email: "user@acme.example",
      expiresAt: Date.now() + 60_000,
      invitationId: randomUUID(),
      tenantId,
      token: "token",
    });
    vi.mocked(getTenantOAuthProviderConfig).mockResolvedValue(null);

    await expect(
      assertOAuthSignUpInvitationAllowed({
        email: "user@acme.example",
        env: { AFENDA_AUTH_INVITATION_GATE: "enabled" },
        providerId: "microsoft",
      })
    ).rejects.toBeInstanceOf(AuthOAuthInvitationRejectedError);
  });

  it("allows OAuth sign-up with pending invitation and enabled tenant provider", async () => {
    const tenantId = randomUUID();
    vi.mocked(findPendingMemberInvitationForEmail)
      .mockResolvedValueOnce({
        email: "user@acme.example",
        expiresAt: Date.now() + 60_000,
        invitationId: randomUUID(),
        tenantId,
        token: "token",
      })
      .mockResolvedValueOnce({
        email: "user@acme.example",
        expiresAt: Date.now() + 60_000,
        invitationId: randomUUID(),
        tenantId,
        token: "token",
      });
    vi.mocked(getTenantOAuthProviderConfig).mockResolvedValue({
      clientId: "",
      displayName: "Google",
      enabled: true,
    });

    await expect(
      assertOAuthSignUpInvitationAllowed({
        email: "user@acme.example",
        env: { AFENDA_AUTH_INVITATION_GATE: "enabled" },
        providerId: "google",
      })
    ).resolves.toBeUndefined();
  });

  it("sets disableImplicitSignUp on social provider options", () => {
    expect(createAfendaOAuthSocialProviderOptions()).toEqual({
      disableImplicitSignUp: true,
    });
  });
});
