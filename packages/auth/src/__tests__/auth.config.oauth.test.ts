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
        AFENDA_OAUTH_MICROSOFT_CLIENT_ID: "microsoft-client-id",
        AFENDA_OAUTH_MICROSOFT_CLIENT_SECRET: "microsoft-client-secret",
      },
    });

    expect(auth.options.socialProviders?.google).toMatchObject({
      clientId: "google-client-id",
      clientSecret: "google-client-secret",
      disableImplicitSignUp: true,
    });
    expect(auth.options.socialProviders?.microsoft).toMatchObject({
      clientId: "microsoft-client-id",
      clientSecret: "microsoft-client-secret",
      disableImplicitSignUp: true,
    });
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
