import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  applyContentSecurityPolicy,
  createCspNonce,
  CSP_NONCE_HEADER,
} from "@/lib/security/csp";

const appRoot = join(import.meta.dirname, "../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("proxy CSP integration", () => {
  const proxySource = readAppSource("src/proxy.ts");

  it("generates CSP per request through applyContentSecurityPolicy", () => {
    expect(proxySource).toContain("applyContentSecurityPolicy");
    expect(proxySource).toContain("resolveCspPolicyMode");
    expect(proxySource).not.toMatch(/const nonce = createCspNonce\(\)/);
  });

  it("preserves auth and correlation behavior", () => {
    expect(proxySource).toContain("getSessionCookie");
    expect(proxySource).toContain("isPublicRoute");
    expect(proxySource).toContain("CORRELATION_ID_HEADER");
    expect(proxySource).toContain("resolveCorrelationIdFromHeaders");
    expect(proxySource).toContain("TENANT_SLUG_HEADER");
    expect(proxySource).toContain("ORGANIZATION_SLUG_PATH_HINT_HEADER");
    expect(proxySource).toContain("resolveWorkspacePathRouting");
    expect(proxySource).toContain("resolveTenantSlugFromRequest");
    expect(proxySource).toContain("DEV_DEFAULT_TENANT_SLUG");
    expect(proxySource).toContain("resolveDevelopmentDefaultTenantSlug");
    expect(proxySource).toContain("NextResponse.rewrite");
  });

  it("excludes api and static assets from the proxy matcher", () => {
    expect(proxySource).toContain("api|_next/static|_next/image|favicon.ico");
    expect(proxySource).toContain("next-router-prefetch");
  });

  it("does not expose nonce on response headers", () => {
    expect(proxySource).not.toMatch(
      /response\.headers\.set\(\s*CSP_NONCE_HEADER/
    );
  });
});

describe("applyContentSecurityPolicy", () => {
  it("sets request and response CSP headers with a request-specific nonce", () => {
    const requestHeaders = new Headers();
    const responseHeaders = new Headers();

    const first = applyContentSecurityPolicy(
      requestHeaders,
      responseHeaders,
      false,
      "nonce"
    );
    const firstPolicy = responseHeaders.get("Content-Security-Policy");

    requestHeaders.delete(CSP_NONCE_HEADER);
    requestHeaders.delete("Content-Security-Policy");
    responseHeaders.delete("Content-Security-Policy");

    const second = applyContentSecurityPolicy(
      requestHeaders,
      responseHeaders,
      false,
      "nonce"
    );
    const secondPolicy = responseHeaders.get("Content-Security-Policy");

    expect(first.mode).toBe("nonce");
    expect(second.mode).toBe("nonce");
    expect(requestHeaders.get(CSP_NONCE_HEADER)).toBe(second.nonce);
    expect(first.nonce).not.toBe(second.nonce);
    expect(firstPolicy).toContain(first.nonce);
    expect(secondPolicy).toContain(second.nonce);
    expect(firstPolicy).not.toBe(secondPolicy);
  });

  it("omits nonce headers in SRI mode for cacheable public HTML", () => {
    const requestHeaders = new Headers({ [CSP_NONCE_HEADER]: "stale" });
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
  });
});

describe("nonce server helper", () => {
  it("reads nonce from the x-nonce request header contract", () => {
    const source = readAppSource("src/lib/security/nonce.server.ts");
    expect(source).toContain("CSP_NONCE_HEADER");
    expect(source).toContain("headers()");
    expect(source).not.toContain("createCspNonce");
  });
});

describe("layout dynamic rendering", () => {
  it("keeps the root layout static for hybrid SRI on public routes", () => {
    const rootSource = readAppSource("src/app/layout.tsx");
    expect(rootSource).not.toContain("connection()");
    expect(rootSource).not.toContain("createCspNonce");
  });

  it("opts protected routes into request-bound rendering for nonce CSP", () => {
    const protectedSource = readAppSource("src/app/(protected)/layout.tsx");
    expect(protectedSource).toContain("connection()");
    expect(protectedSource).toContain("requiresProtectedLayoutConnection");
  });
});

describe("next.config SRI build integration", () => {
  it("enables experimental sha256 SRI for static script integrity", () => {
    const source = readAppSource("next.config.ts");
    expect(source).toContain("experimental");
    expect(source).toContain('algorithm: "sha256"');
  });

  it("allows 127.0.0.1 dev tooling origins so Turbopack HMR hydrates client trees", () => {
    const source = readAppSource("next.config.ts");
    expect(source).toContain("allowedDevOrigins");
    expect(source).toContain('"127.0.0.1"');
  });
});

describe("createCspNonce runtime safety", () => {
  it("does not reuse values across calls", () => {
    const values = new Set(
      Array.from({ length: 20 }, () => createCspNonce())
    );

    expect(values.size).toBe(20);
  });
});
