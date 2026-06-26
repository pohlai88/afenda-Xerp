import { beforeEach, describe, expect, it, vi } from "vitest";

import { createAuthConfig } from "../auth.config.js";
import type { BetterAuthSocialProviderConfig } from "../auth.env.js";
import {
  AFENDA_AUTH_OAUTH_CALLBACK_PREFIX,
  createAfendaGithubSocialProviderConfig,
} from "../auth.oauth-policy.js";

vi.mock("@afenda/database", () => ({
  authSchema: {},
  getAuthDb: vi.fn(() => ({})),
}));

function isBetterAuthSocialProviderConfig(
  value: unknown
): value is BetterAuthSocialProviderConfig {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "clientId" in value &&
    typeof value.clientId === "string" &&
    "clientSecret" in value &&
    typeof value.clientSecret === "string"
  );
}

function resolveRegisteredSocialProviderConfig(
  provider: unknown
): BetterAuthSocialProviderConfig {
  if (typeof provider === "function") {
    const resolved = provider({});

    if (resolved instanceof Promise) {
      throw new Error(
        "Expected synchronous Better Auth social provider config"
      );
    }

    if (!isBetterAuthSocialProviderConfig(resolved)) {
      throw new Error("Resolved value is not a social provider config");
    }

    return resolved;
  }

  if (!isBetterAuthSocialProviderConfig(provider)) {
    throw new Error("Expected a social provider config");
  }

  return provider;
}

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

    const githubFromFactory = createAfendaGithubSocialProviderConfig({
      clientId: "github-client-id",
      clientSecret: "github-client-secret",
    });
    const githubFromAuth = resolveRegisteredSocialProviderConfig(
      auth.options.socialProviders?.github
    );

    expect(auth.options.socialProviders?.google).toMatchObject({
      clientId: "google-client-id",
      clientSecret: "google-client-secret",
      disableImplicitSignUp: true,
      prompt: "select_account",
    });
    expect(githubFromAuth).toMatchObject({
      clientId: "github-client-id",
      clientSecret: "github-client-secret",
      disableImplicitSignUp: true,
      scope: ["read:user", "user:email"],
    });
    expect(githubFromAuth.mapProfileToUser).toBeTypeOf("function");
    expect(githubFromAuth.mapProfileToUser).toBe(
      githubFromFactory.mapProfileToUser
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
