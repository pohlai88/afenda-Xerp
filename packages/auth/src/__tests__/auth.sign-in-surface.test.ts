import { describe, expect, it } from "vitest";

import { resolveSignInProviderSurface } from "../auth.sign-in-surface.js";

describe("resolveSignInProviderSurface", () => {
  it("returns empty social providers when env keys are absent", () => {
    expect(
      resolveSignInProviderSurface({
        AFENDA_AUTH_PASSKEY: "enabled",
      })
    ).toEqual({
      passkeyEnabled: true,
      socialProviderIds: [],
      ssoEnabled: true,
    });
  });

  it("lists configured social providers and disables passkey when flagged", () => {
    expect(
      resolveSignInProviderSurface({
        AFENDA_AUTH_PASSKEY: "disabled",
        AFENDA_OAUTH_GOOGLE_CLIENT_ID: "google-id",
        AFENDA_OAUTH_GOOGLE_CLIENT_SECRET: "google-secret",
      })
    ).toEqual({
      passkeyEnabled: false,
      socialProviderIds: ["google"],
      ssoEnabled: true,
    });
  });
});
