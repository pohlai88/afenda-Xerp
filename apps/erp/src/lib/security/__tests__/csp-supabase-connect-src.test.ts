import { describe, expect, it } from "vitest";
import type { EnvReaderSource } from "@/lib/env/env-reader-source";

import { createContentSecurityPolicy } from "@/lib/security/csp";
import {
  resolveSupabaseConnectSrcOrigins,
  resolveSupabaseCspPlatformOrigins,
} from "@/lib/security/csp-supabase-connect-src";

const SUPABASE_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example-ref.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
} as const satisfies EnvReaderSource;

const MCP_VERIFIED_PROJECT_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: "https://esxjzvcfqtaxmiwjntje.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
} as const satisfies EnvReaderSource;

describe("resolveSupabaseCspPlatformOrigins", () => {
  it("returns empty origins when public Supabase env is unset", () => {
    expect(resolveSupabaseCspPlatformOrigins({})).toEqual({
      connectSrc: [],
      imgSrc: [],
    });
  });

  it("returns explicit https and wss connect-src plus https img-src", () => {
    expect(resolveSupabaseCspPlatformOrigins(SUPABASE_ENV)).toEqual({
      connectSrc: [
        "https://example-ref.supabase.co",
        "wss://example-ref.supabase.co",
      ],
      imgSrc: ["https://example-ref.supabase.co"],
    });
  });

  it("matches MCP-verified Afenda project host without wildcards", () => {
    expect(resolveSupabaseCspPlatformOrigins(MCP_VERIFIED_PROJECT_ENV)).toEqual(
      {
        connectSrc: [
          "https://esxjzvcfqtaxmiwjntje.supabase.co",
          "wss://esxjzvcfqtaxmiwjntje.supabase.co",
        ],
        imgSrc: ["https://esxjzvcfqtaxmiwjntje.supabase.co"],
      }
    );
  });
});

describe("resolveSupabaseConnectSrcOrigins", () => {
  it("returns empty origins when public Supabase env is unset", () => {
    expect(resolveSupabaseConnectSrcOrigins({})).toEqual([]);
  });

  it("returns explicit https and wss origins for the configured project", () => {
    expect(resolveSupabaseConnectSrcOrigins(SUPABASE_ENV)).toEqual([
      "https://example-ref.supabase.co",
      "wss://example-ref.supabase.co",
    ]);
  });

  it("normalizes trailing slashes on the project URL", () => {
    expect(
      resolveSupabaseConnectSrcOrigins({
        ...SUPABASE_ENV,
        NEXT_PUBLIC_SUPABASE_URL: "https://example-ref.supabase.co/",
      })
    ).toEqual([
      "https://example-ref.supabase.co",
      "wss://example-ref.supabase.co",
    ]);
  });
});

describe("createContentSecurityPolicy + Supabase platform origins", () => {
  it("includes explicit Supabase REST, Realtime, and Storage img origins in production", () => {
    const policy = createContentSecurityPolicy({
      env: SUPABASE_ENV,
      isDevelopment: false,
      mode: "nonce",
      nonce: "abc",
    });

    expect(policy).toContain("connect-src 'self'");
    expect(policy).toContain("https://example-ref.supabase.co");
    expect(policy).toContain("wss://example-ref.supabase.co");
    expect(policy).toContain("img-src 'self' blob: data:");
    expect(policy).toContain("https://example-ref.supabase.co");
    expect(policy).not.toMatch(/\*/);
    expect(policy).not.toMatch(/\bhttps:\b/);
  });

  it("omits Supabase origins when public env is not configured", () => {
    const policy = createContentSecurityPolicy({
      env: {},
      isDevelopment: false,
      mode: "nonce",
      nonce: "abc",
    });

    expect(policy).toContain("connect-src 'self'");
    expect(policy).not.toContain("supabase.co");
  });
});
