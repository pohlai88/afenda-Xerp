import { beforeEach, describe, expect, it, vi } from "vitest";

import { createAuthConfig } from "../auth.config.js";
import {
  BETTER_AUTH_WEBAUTHN_RP_NAME,
  resolveBetterAuthWebAuthnOrigin,
  resolveBetterAuthWebAuthnRpId,
} from "../auth.env.js";

vi.mock("@afenda/database", () => ({
  authSchema: {},
  getAuthDb: vi.fn(() => ({})),
}));

describe("auth.config passkey wiring", () => {
  beforeEach(() => {
    vi.stubEnv("BETTER_AUTH_SECRET", "integration-test-secret-32-chars!!");
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  });

  it("registers Better Auth passkey plugin with session-required registration", () => {
    const env = {
      BETTER_AUTH_SECRET: "integration-test-secret-32-chars!!",
      BETTER_AUTH_URL: "http://localhost:3000",
    };

    const auth = createAuthConfig({ env });
    const pluginIds = auth.options.plugins?.map((plugin) => plugin.id) ?? [];

    expect(pluginIds).toContain("passkey");
    expect(resolveBetterAuthWebAuthnOrigin(env)).toBe("http://localhost:3000");
    expect(resolveBetterAuthWebAuthnRpId(env)).toBe("localhost");
    expect(BETTER_AUTH_WEBAUTHN_RP_NAME).toBe("Afenda ERP");
  });
});
