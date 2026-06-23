import { describe, expect, it } from "vitest";

import {
  getCspStrategy,
  requiresProtectedLayoutConnection,
  resolveCspPolicyMode,
  shouldOptIntoRequestBoundRendering,
} from "@/lib/security/csp-strategy";

describe("csp-strategy", () => {
  it("defaults to hybrid when env is unset", () => {
    expect(getCspStrategy({})).toBe("hybrid");
  });

  it("defaults to hybrid for unknown strategy values", () => {
    expect(getCspStrategy({ ERP_CSP_STRATEGY: "invalid" })).toBe("hybrid");
  });

  it("uses SRI on public routes in hybrid production mode", () => {
    expect(
      resolveCspPolicyMode(
        "/sign-in",
        { ERP_CSP_STRATEGY: "hybrid", NODE_ENV: "production" },
        false
      )
    ).toBe("sri");
  });

  it("uses nonce on protected routes in hybrid production mode", () => {
    expect(
      resolveCspPolicyMode(
        "/dashboard",
        { ERP_CSP_STRATEGY: "hybrid", NODE_ENV: "production" },
        false
      )
    ).toBe("nonce");
  });

  it("uses nonce on all routes in hybrid development mode", () => {
    expect(
      resolveCspPolicyMode(
        "/sign-in",
        { ERP_CSP_STRATEGY: "hybrid", NODE_ENV: "development" },
        true
      )
    ).toBe("nonce");
  });

  it("uses nonce everywhere when strategy is nonce", () => {
    expect(
      resolveCspPolicyMode("/sign-in", { ERP_CSP_STRATEGY: "nonce" })
    ).toBe("nonce");
  });

  it("uses SRI everywhere in production when strategy is sri", () => {
    expect(
      resolveCspPolicyMode(
        "/dashboard",
        { ERP_CSP_STRATEGY: "sri", NODE_ENV: "production" },
        false
      )
    ).toBe("sri");
  });

  it("uses nonce everywhere in development when strategy is sri", () => {
    expect(
      resolveCspPolicyMode(
        "/dashboard",
        { ERP_CSP_STRATEGY: "sri", NODE_ENV: "development" },
        true
      )
    ).toBe("nonce");
  });

  it("requires request-bound rendering only for nonce-protected routes", () => {
    expect(
      shouldOptIntoRequestBoundRendering("/sign-in", {
        ERP_CSP_STRATEGY: "hybrid",
        NODE_ENV: "production",
      })
    ).toBe(false);
    expect(
      shouldOptIntoRequestBoundRendering("/dashboard", {
        ERP_CSP_STRATEGY: "hybrid",
        NODE_ENV: "production",
      })
    ).toBe(true);
  });

  it("requires protected layout connection unless strategy is full sri", () => {
    expect(
      requiresProtectedLayoutConnection({ ERP_CSP_STRATEGY: "hybrid" })
    ).toBe(true);
    expect(
      requiresProtectedLayoutConnection({ ERP_CSP_STRATEGY: "nonce" })
    ).toBe(true);
    expect(requiresProtectedLayoutConnection({ ERP_CSP_STRATEGY: "sri" })).toBe(
      false
    );
  });
});
