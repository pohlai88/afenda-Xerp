import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  CSP_NONCE_HEADER,
  createContentSecurityPolicy,
  createCspNonce,
} from "@/lib/security/csp";

describe("createCspNonce", () => {
  it("returns unique values per invocation", () => {
    const first = createCspNonce();
    const second = createCspNonce();

    expect(first.length).toBeGreaterThan(0);
    expect(second.length).toBeGreaterThan(0);
    expect(first).not.toBe(second);
  });
});

describe("createContentSecurityPolicy", () => {
  const nonce = "test-nonce-value";

  it("uses strict production script and style directives", () => {
    const policy = createContentSecurityPolicy({
      isDevelopment: false,
      mode: "nonce",
      nonce,
    });

    expect(policy).toContain(
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    );
    expect(policy).toContain(`style-src 'self' 'nonce-${nonce}'`);
    expect(policy).not.toContain("'unsafe-inline'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("upgrade-insecure-requests");
    expect(policy).toContain("connect-src 'self'");
    expect(policy).not.toMatch(/\*/);
    expect(policy).not.toMatch(/\bhttps:\b/);
  });

  it("relaxes only development tooling directives", () => {
    const policy = createContentSecurityPolicy({
      isDevelopment: true,
      mode: "nonce",
      nonce,
    });

    expect(policy).toContain("'unsafe-eval'");
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
    expect(policy).not.toContain(`style-src 'self' 'nonce-${nonce}'`);
    expect(policy).toContain("connect-src 'self' ws: wss:");
    expect(policy).not.toContain("upgrade-insecure-requests");
    expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it("uses hash-compatible SRI script directives in production", () => {
    const policy = createContentSecurityPolicy({
      isDevelopment: false,
      mode: "sri",
    });

    expect(policy).toContain("script-src 'self'");
    expect(policy).not.toContain("'nonce-");
    expect(policy).not.toContain("'strict-dynamic'");
    expect(policy).toContain("style-src 'self'");
    expect(policy).not.toContain("'unsafe-inline'");
  });

  it("relaxes SRI development tooling directives only", () => {
    const policy = createContentSecurityPolicy({
      isDevelopment: true,
      mode: "sri",
    });

    expect(policy).toContain("script-src 'self' 'unsafe-eval'");
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
  });
});

describe("CSP constants", () => {
  it("uses the canonical nonce request header name", () => {
    expect(CSP_NONCE_HEADER).toBe("x-nonce");
  });
});

describe("csp.ts Supabase wiring", () => {
  it("resolves platform origins via resolveSupabaseCspPlatformOrigins", () => {
    const source = readFileSync(
      resolve(import.meta.dirname, "../csp.ts"),
      "utf8"
    );

    expect(source).toContain("resolveSupabaseCspPlatformOrigins");
    expect(source).not.toMatch(/\bresolveSupabaseConnectSrcOrigins\s*\(/);
  });
});
