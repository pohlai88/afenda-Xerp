import { beforeEach, describe, expect, it, vi } from "vitest";

import { createAuthConfig } from "../auth.config.js";
import { AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX } from "../auth.sso-policy.js";

vi.mock("@afenda/database", () => ({
  authSchema: {},
  getAuthDb: vi.fn(() => ({})),
}));

describe("auth.config SSO wiring", () => {
  beforeEach(() => {
    vi.stubEnv("BETTER_AUTH_SECRET", "integration-test-secret-32-chars!!");
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  });

  it("registers Better Auth SSO plugin with invitation-gated provisioning", () => {
    const auth = createAuthConfig({
      env: {
        BETTER_AUTH_SECRET: "integration-test-secret-32-chars!!",
        BETTER_AUTH_URL: "http://localhost:3000",
        AFENDA_AUTH_INVITATION_GATE: "enabled",
      },
    });

    const pluginIds = auth.options.plugins?.map((plugin) => plugin.id) ?? [];
    expect(pluginIds).toContain("sso");
    expect(AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX).toBe("/sso/callback/");
  });
});
