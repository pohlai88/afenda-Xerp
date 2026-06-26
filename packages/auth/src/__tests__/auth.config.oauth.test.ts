import { beforeEach, describe, expect, it, vi } from "vitest";

import { createAuthConfig } from "../auth.config.js";
import { AFENDA_AUTH_OAUTH_CALLBACK_PREFIX } from "../auth.oauth-policy.js";

vi.mock("@afenda/database", () => ({
  authSchema: {},
  getAuthDb: vi.fn(() => ({})),
}));

describe("auth.config OAuth wiring", () => {
  beforeEach(() => {
    vi.stubEnv("BETTER_AUTH_SECRET", "integration-test-secret-32-chars!!");
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  });

  it("registers Better Auth socialProviders when platform OAuth env is configured", () => {
    const auth = createAuthConfig({
      env: {
        BETTER_AUTH_SECRET: "integration-test-secret-32-chars!!",
        BETTER_AUTH_URL: "http://localhost:3000",
        AFENDA_OAUTH_GOOGLE_CLIENT_ID: "google-client-id",
        AFENDA_OAUTH_GOOGLE_CLIENT_SECRET: "google-client-secret",
        AFENDA_OAUTH_GITHUB_CLIENT_ID: "github-client-id",
        AFENDA_OAUTH_GITHUB_CLIENT_SECRET: "github-client-secret",
      },
    });

    expect(auth.options.socialProviders?.google).toMatchObject({
      clientId: "google-client-id",
      clientSecret: "google-client-secret",
      disableImplicitSignUp: true,
      prompt: "select_account",
    });
    expect(auth.options.socialProviders?.github).toMatchObject({
      clientId: "github-client-id",
      clientSecret: "github-client-secret",
      disableImplicitSignUp: true,
      scope: ["read:user", "user:email"],
    });
    expect(auth.options.socialProviders?.github?.mapProfileToUser).toBeTypeOf(
      "function"
    );
    expect(auth.options.databaseHooks?.user?.create?.before).toBeDefined();
    expect(AFENDA_AUTH_OAUTH_CALLBACK_PREFIX).toBe("/callback/");
  });

  it("omits socialProviders when OAuth env credentials are absent", () => {
    const auth = createAuthConfig({
      env: {
        BETTER_AUTH_SECRET: "integration-test-secret-32-chars!!",
        BETTER_AUTH_URL: "http://localhost:3000",
      },
    });

    expect(auth.options.socialProviders).toBeUndefined();
  });
});
