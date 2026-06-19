import { describe, expect, it } from "vitest";

import {
  getSupabaseJwksUrl,
  getSupabaseJwtKeyId,
  getSupabasePublicKey,
  getSupabasePublicUrl,
  getSupabaseSecretKey,
  hasSupabaseJwtConfig,
  hasSupabasePublicConfig,
  hasSupabaseSecretKey,
  MissingSupabasePublicKeyError,
  MissingSupabasePublicUrlError,
  MissingSupabaseSecretKeyError,
  SUPABASE_PUBLIC_ANON_KEY_ENV,
  SUPABASE_PUBLIC_PUBLISHABLE_KEY_ENV,
  SUPABASE_PUBLIC_URL_ENV,
  SUPABASE_SECRET_KEY_ENV,
} from "../lib/supabase/env";

describe("Supabase env validation", () => {
  it("reads public URL and publishable key from NEXT_PUBLIC_* vars", () => {
    const env = {
      [SUPABASE_PUBLIC_URL_ENV]: "https://example.supabase.co",
      [SUPABASE_PUBLIC_PUBLISHABLE_KEY_ENV]: "sb_publishable_test",
    };

    expect(getSupabasePublicUrl(env)).toBe("https://example.supabase.co");
    expect(getSupabasePublicKey(env)).toBe("sb_publishable_test");
    expect(hasSupabasePublicConfig(env)).toBe(true);
  });

  it("falls back to legacy anon key name", () => {
    const env = {
      [SUPABASE_PUBLIC_URL_ENV]: "https://example.supabase.co",
      [SUPABASE_PUBLIC_ANON_KEY_ENV]: "legacy-anon-key",
    };

    expect(getSupabasePublicKey(env)).toBe("legacy-anon-key");
  });

  it("throws clear errors when public config is incomplete", () => {
    expect(() => getSupabasePublicUrl({})).toThrow(
      MissingSupabasePublicUrlError
    );
    expect(() =>
      getSupabasePublicKey({
        [SUPABASE_PUBLIC_URL_ENV]: "https://example.supabase.co",
      })
    ).toThrow(MissingSupabasePublicKeyError);
    expect(hasSupabasePublicConfig({})).toBe(false);
  });

  it("reads secret key for privileged server operations", () => {
    const env = {
      [SUPABASE_SECRET_KEY_ENV]: "sb_secret_test",
    };

    expect(getSupabaseSecretKey(env)).toBe("sb_secret_test");
    expect(hasSupabaseSecretKey(env)).toBe(true);
  });

  it("throws when secret key is missing", () => {
    expect(() => getSupabaseSecretKey({})).toThrow(
      MissingSupabaseSecretKeyError
    );
    expect(hasSupabaseSecretKey({})).toBe(false);
  });

  it("derives JWKS URL and reads pinned JWT key id", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example-ref.supabase.co",
      SUPABASE_JWT_KID: "a9b24fa2-cca6-427d-941f-538cd36c1a0f",
    };

    expect(getSupabaseJwksUrl(env)).toBe(
      "https://example-ref.supabase.co/auth/v1/.well-known/jwks.json"
    );
    expect(getSupabaseJwtKeyId(env)).toBe(
      "a9b24fa2-cca6-427d-941f-538cd36c1a0f"
    );
    expect(hasSupabaseJwtConfig(env)).toBe(true);
  });
});
