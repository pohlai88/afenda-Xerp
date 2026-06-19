import { describe, expect, it } from "vitest";

import { getSupabaseServerEnv } from "../lib/supabase/server-env";

describe("getSupabaseServerEnv", () => {
  it("maps Afenda env vars to SupabaseEnv overrides", () => {
    const env = {
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      SUPABASE_SECRET_KEY: "sb_secret_test",
      SUPABASE_JWKS_URL:
        "https://example.supabase.co/auth/v1/.well-known/jwks.json",
    };

    expect(getSupabaseServerEnv(env)).toEqual({
      url: "https://example.supabase.co",
      publishableKeys: { default: "sb_publishable_test" },
      secretKeys: { default: "sb_secret_test" },
      jwks: new URL(
        "https://example.supabase.co/auth/v1/.well-known/jwks.json"
      ),
    });
  });

  it("falls back to NEXT_PUBLIC_* browser vars", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example-ref.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_browser",
    };

    const overrides = getSupabaseServerEnv(env);

    expect(overrides.url).toBe("https://example-ref.supabase.co");
    expect(overrides.publishableKeys).toEqual({
      default: "sb_publishable_browser",
    });
    expect(overrides.jwks?.toString()).toBe(
      "https://example-ref.supabase.co/auth/v1/.well-known/jwks.json"
    );
  });

  it("derives JWKS URL from the project URL when explicit URL is absent", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example-ref.supabase.co/",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_browser",
    };

    expect(getSupabaseServerEnv(env).jwks).toEqual(
      new URL("https://example-ref.supabase.co/auth/v1/.well-known/jwks.json")
    );
  });
});
