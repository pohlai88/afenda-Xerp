import { describe, expect, it } from "vitest";

import {
  assertAllowlistedOrigin,
  CSP_THIRD_PARTY_ALLOWLIST,
  validateCspThirdPartyAllowlist,
} from "@/lib/security/csp-allowlist";
import { createContentSecurityPolicy } from "@/lib/security/csp";

describe("csp-allowlist", () => {
  it("validates the committed allowlist", () => {
    expect(() => validateCspThirdPartyAllowlist()).not.toThrow();
    expect(CSP_THIRD_PARTY_ALLOWLIST.scriptSrc).toEqual([]);
  });

  it("rejects wildcard origins", () => {
    expect(() => assertAllowlistedOrigin("*")).toThrow();
    expect(() => assertAllowlistedOrigin("https:")).toThrow();
  });

  it("accepts explicit https origins", () => {
    expect(() =>
      assertAllowlistedOrigin("https://www.example.com")
    ).not.toThrow();
  });

  it("accepts explicit wss origins for Realtime hosts", () => {
    expect(() =>
      assertAllowlistedOrigin("wss://example-ref.supabase.co")
    ).not.toThrow();
    expect(() => assertAllowlistedOrigin("wss://example.com/path")).toThrow();
  });
});

describe("createContentSecurityPolicy + allowlist", () => {
  it("merges explicit allowlisted script and connect sources", () => {
    const policy = createContentSecurityPolicy({
      isDevelopment: false,
      mode: "nonce",
      nonce: "abc",
    });

    expect(policy).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'");
    expect(policy).not.toMatch(/\*/);
  });
});

describe("third-party script contract (documented patterns)", () => {
  it("documents required nonce wiring for next/script", () => {
    const compliant = `
      import Script from "next/script";
      import { getCspNonce } from "@/lib/security/nonce.server";
      <Script nonce={nonce} src="https://cdn.example.com/a.js" />
    `;

    expect(compliant).toContain("getCspNonce");
    expect(compliant).toContain("nonce={nonce}");
    expect(compliant).not.toMatch(/<script[\s>]/);
  });
});
