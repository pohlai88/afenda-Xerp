import { describe, expect, it } from "vitest";

import { resolveSignInProviderSurface } from "../auth.sign-in-surface.js";

describe("resolveSignInProviderSurface", () => {
  it("returns empty social providers when env keys are absent", () => {
    expect(
      resolveSignInProviderSurface({
        AFENDA_AUTH_PASSKEY: "enabled",
      })
    ).toEqual({
      emailDeliveryEnabled: false,
      invitationGateEnabled: true,
      passkeyEnabled: true,
      socialProviderIds: [],
      ssoEnabled: true,
    });
  });

  it("lists configured social providers and disables passkey when flagged", () => {
    expect(
      resolveSignInProviderSurface({
        AFENDA_AUTH_PASSKEY: "disabled",
        AFENDA_AUTH_EMAIL_API_KEY: "resend-key",
        AFENDA_AUTH_INVITATION_GATE: "disabled",
        AFENDA_AUTH_SSO: "disabled",
        AFENDA_OAUTH_GOOGLE_CLIENT_ID: "google-id",
        AFENDA_OAUTH_GOOGLE_CLIENT_SECRET: "google-secret",
      })
    ).toEqual({
      emailDeliveryEnabled: true,
      invitationGateEnabled: false,
      passkeyEnabled: false,
      socialProviderIds: ["google"],
      ssoEnabled: false,
    });
  });

  it("ignores partially configured social providers", () => {
    expect(
      resolveSignInProviderSurface({
        AFENDA_OAUTH_GITHUB_CLIENT_ID: "github-id",
        AFENDA_OAUTH_GOOGLE_CLIENT_SECRET: "google-secret",
      }).socialProviderIds
    ).toEqual([]);
  });
});
