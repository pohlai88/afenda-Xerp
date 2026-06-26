import { createHmac } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { AFENDA_MFA_CHALLENGE_COOKIE } from "@/lib/auth/auth-mfa-challenge.constants";

const cookieStore = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) => {
      const value = cookieStore.get(name);
      return value === undefined ? undefined : { name, value };
    },
    set: (name: string, value: string) => {
      cookieStore.set(name, value);
    },
    delete: (name: string) => {
      cookieStore.delete(name);
    },
  })),
}));

vi.mock("@afenda/entitlements", () => ({
  getUpstashRedisConfig: () => null,
}));

vi.mock("@afenda/auth", () => ({
  getBetterAuthSecret: () => "test-secret-32-characters-minimum!!",
}));

describe("auth-mfa-challenge.cookies.server", () => {
  beforeEach(() => {
    cookieStore.clear();
    vi.resetModules();
  });

  it("persists and reads a signed MFA challenge cookie", async () => {
    const { persistMfaChallengeCookie, readMfaChallengeCookie } = await import(
      "@/lib/auth/auth-mfa-challenge.cookies.server"
    );

    await persistMfaChallengeCookie({ methods: ["totp"] }, "/reports");

    await expect(readMfaChallengeCookie()).resolves.toEqual({
      challenge: { methods: ["totp"] },
      nextPath: "/reports",
    });
  });

  it("rejects tampered cookie payloads", async () => {
    const { readMfaChallengeCookie } = await import(
      "@/lib/auth/auth-mfa-challenge.cookies.server"
    );

    const serialized = JSON.stringify({
      challenge: { methods: ["totp"] },
      nextPath: "/",
      exp: Date.now() + 60_000,
    });
    const signature = createHmac(
      "sha256",
      "test-secret-32-characters-minimum!!"
    )
      .update(serialized)
      .digest("base64url");

    cookieStore.set(AFENDA_MFA_CHALLENGE_COOKIE, `${serialized}.${signature}x`);

    await expect(readMfaChallengeCookie()).resolves.toBeNull();
  });

  it("clears the MFA challenge cookie", async () => {
    const {
      clearMfaChallengeCookie,
      persistMfaChallengeCookie,
      readMfaChallengeCookie,
    } = await import("@/lib/auth/auth-mfa-challenge.cookies.server");

    await persistMfaChallengeCookie({ methods: ["otp"] }, "/");
    await clearMfaChallengeCookie();

    await expect(readMfaChallengeCookie()).resolves.toBeNull();
  });
});
