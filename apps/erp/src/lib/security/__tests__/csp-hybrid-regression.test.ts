import { describe, expect, it } from "vitest";

import {
  applyContentSecurityPolicy,
  createContentSecurityPolicy,
  CSP_NONCE_HEADER,
} from "@/lib/security/csp";
import { resolveCspPolicyMode } from "@/lib/security/csp-strategy";

const HYBRID_ENV = { ERP_CSP_STRATEGY: "hybrid" } as const satisfies NodeJS.ProcessEnv;

describe("csp hybrid regression", () => {
  it("applies SRI CSP on public sign-in without nonce headers", () => {
    expect(
      resolveCspPolicyMode("/sign-in", HYBRID_ENV, false)
    ).toBe("sri");

    const requestHeaders = new Headers();
    const responseHeaders = new Headers();

    const result = applyContentSecurityPolicy(
      requestHeaders,
      responseHeaders,
      false,
      "sri"
    );
    const policy = responseHeaders.get("Content-Security-Policy");

    expect(result).toEqual({ mode: "sri", nonce: null });
    expect(requestHeaders.has(CSP_NONCE_HEADER)).toBe(false);
    expect(policy).toContain("script-src 'self'");
    expect(policy).not.toContain("'nonce-");
    expect(policy).not.toContain("'strict-dynamic'");
    expect(policy).toContain("object-src 'none'");
  });

  it("applies nonce CSP on protected dashboard routes", () => {
    expect(resolveCspPolicyMode("/", HYBRID_ENV, false)).toBe("nonce");

    const requestHeaders = new Headers();
    const responseHeaders = new Headers();

    const result = applyContentSecurityPolicy(
      requestHeaders,
      responseHeaders,
      false,
      "nonce"
    );
    const policy = responseHeaders.get("Content-Security-Policy");

    expect(result.mode).toBe("nonce");
    expect(result.nonce).toBeTruthy();
    expect(requestHeaders.get(CSP_NONCE_HEADER)).toBe(result.nonce);
    expect(policy).toContain(`'nonce-${result.nonce}'`);
    expect(policy).toContain("'strict-dynamic'");
  });

  it("keeps nonce mode when ERP_CSP_STRATEGY=nonce", () => {
    expect(
      resolveCspPolicyMode("/sign-in", { ERP_CSP_STRATEGY: "nonce" })
    ).toBe("nonce");

    const policy = createContentSecurityPolicy({
      isDevelopment: false,
      mode: "nonce",
      nonce: "fixed-test-nonce",
    });

    expect(policy).toContain("'nonce-fixed-test-nonce'");
    expect(policy).toContain("'strict-dynamic'");
  });

  it("uses full SRI when ERP_CSP_STRATEGY=sri in production", () => {
    expect(
      resolveCspPolicyMode("/", { ERP_CSP_STRATEGY: "sri" }, false)
    ).toBe("sri");

    const policy = createContentSecurityPolicy({
      isDevelopment: false,
      mode: "sri",
    });

    expect(policy).toContain("script-src 'self'");
    expect(policy).not.toContain("'nonce-");
  });
});
