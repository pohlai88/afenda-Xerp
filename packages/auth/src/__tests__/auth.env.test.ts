import { describe, expect, it } from "vitest";

import {
  getBetterAuthSecret,
  getBetterAuthUrl,
  hasBetterAuthConfig,
  isAuthChangeEmailEnabled,
  isAuthEmailDeliveryEnabled,
  resolveBetterAuthBaseUrl,
  resolveBetterAuthTrustedOrigins,
  resolveBetterAuthWebAuthnOrigin,
  resolveBetterAuthWebAuthnRpId,
  resolveBetterAuthWebAuthnRpName,
} from "../auth.env.js";
import {
  MissingBetterAuthSecretError,
  MissingBetterAuthUrlError,
} from "../auth.errors.js";

describe("auth.env", () => {
  it("requires BETTER_AUTH_SECRET with minimum length", () => {
    expect(() => getBetterAuthSecret({})).toThrow(MissingBetterAuthSecretError);
    expect(() => getBetterAuthSecret({ BETTER_AUTH_SECRET: "short" })).toThrow(
      MissingBetterAuthSecretError
    );
  });

  it("requires BETTER_AUTH_URL", () => {
    expect(() => getBetterAuthUrl({})).toThrow(MissingBetterAuthUrlError);
  });

  it("trims trailing slashes from BETTER_AUTH_URL", () => {
    const env = {
      BETTER_AUTH_SECRET: "x".repeat(32),
      BETTER_AUTH_URL: "http://localhost:3000/",
    };

    expect(getBetterAuthUrl(env)).toBe("http://localhost:3000");
  });

  it("prefers VERCEL_URL for preview base URL and trusted origins", () => {
    const env = {
      BETTER_AUTH_SECRET: "x".repeat(32),
      BETTER_AUTH_URL: "https://www.nexuscanon.com",
      VERCEL_URL: "afenda-xforge-preview.vercel.app",
    };

    expect(resolveBetterAuthBaseUrl(env)).toBe(
      "https://afenda-xforge-preview.vercel.app"
    );
    expect(resolveBetterAuthTrustedOrigins(env)).toEqual([
      "https://www.nexuscanon.com",
      "https://afenda-xforge-preview.vercel.app",
    ]);
  });

  it("reports configuration readiness via hasBetterAuthConfig", () => {
    expect(hasBetterAuthConfig({})).toBe(false);
    expect(
      hasBetterAuthConfig({
        BETTER_AUTH_SECRET: "x".repeat(32),
        BETTER_AUTH_URL: "http://localhost:3000",
      })
    ).toBe(true);
  });

  it("reports auth email delivery readiness via isAuthEmailDeliveryEnabled", () => {
    expect(isAuthEmailDeliveryEnabled({})).toBe(false);
    expect(
      isAuthEmailDeliveryEnabled({
        AFENDA_AUTH_EMAIL_API_KEY: "re_test_key",
      })
    ).toBe(true);
  });

  it("reports change-email readiness via isAuthChangeEmailEnabled", () => {
    expect(isAuthChangeEmailEnabled()).toBe(true);
  });

  it("derives WebAuthn origin and rpID from Better Auth base URL", () => {
    const env = {
      BETTER_AUTH_SECRET: "x".repeat(32),
      BETTER_AUTH_URL: "https://erp.example.com/",
    };

    expect(resolveBetterAuthWebAuthnOrigin(env)).toBe(
      "https://erp.example.com"
    );
    expect(resolveBetterAuthWebAuthnRpId(env)).toBe("erp.example.com");
    expect(resolveBetterAuthWebAuthnRpName()).toBe("Afenda ERP");
  });
});
