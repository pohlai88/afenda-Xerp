import { describe, expect, it } from "vitest";
import type { EnvReaderSource } from "@/lib/env/env-reader-source";

import {
  getCspStrategy,
  requiresProtectedLayoutConnection,
  resolveCspPolicyMode,
  shouldOptIntoRequestBoundRendering,
} from "@/lib/security/csp-strategy";

describe("csp-strategy", () => {
  it("defaults to hybrid when env is unset", () => {
    expect(getCspStrategy({} satisfies EnvReaderSource)).toBe("hybrid");
  });

  it("defaults to hybrid for unknown strategy values", () => {
    expect(
      getCspStrategy({ ERP_CSP_STRATEGY: "invalid" } satisfies EnvReaderSource)
    ).toBe("hybrid");
  });

  it("uses SRI on public routes in hybrid production mode", () => {
    expect(
      resolveCspPolicyMode(
        "/sign-in",
        {
          ERP_CSP_STRATEGY: "hybrid",
          NODE_ENV: "production",
        } satisfies EnvReaderSource,
        false
      )
    ).toBe("sri");
  });

  it("uses nonce on protected routes in hybrid production mode", () => {
    expect(
      resolveCspPolicyMode(
        "/dashboard",
        {
          ERP_CSP_STRATEGY: "hybrid",
          NODE_ENV: "production",
        } satisfies EnvReaderSource,
        false
      )
    ).toBe("nonce");
  });

  it("uses nonce on all routes in hybrid development mode", () => {
    expect(
      resolveCspPolicyMode(
        "/sign-in",
        {
          ERP_CSP_STRATEGY: "hybrid",
          NODE_ENV: "development",
        } satisfies EnvReaderSource,
        true
      )
    ).toBe("nonce");
  });

  it("uses nonce everywhere when strategy is nonce", () => {
    expect(
      resolveCspPolicyMode("/sign-in", {
        ERP_CSP_STRATEGY: "nonce",
      } satisfies EnvReaderSource)
    ).toBe("nonce");
  });

  it("uses SRI everywhere in production when strategy is sri", () => {
    expect(
      resolveCspPolicyMode(
        "/dashboard",
        {
          ERP_CSP_STRATEGY: "sri",
          NODE_ENV: "production",
        } satisfies EnvReaderSource,
        false
      )
    ).toBe("sri");
  });

  it("uses nonce everywhere in development when strategy is sri", () => {
    expect(
      resolveCspPolicyMode(
        "/dashboard",
        {
          ERP_CSP_STRATEGY: "sri",
          NODE_ENV: "development",
        } satisfies EnvReaderSource,
        true
      )
    ).toBe("nonce");
  });

  it("requires request-bound rendering only for nonce-protected routes", () => {
    expect(
      shouldOptIntoRequestBoundRendering("/sign-in", {
        ERP_CSP_STRATEGY: "hybrid",
        NODE_ENV: "production",
      } satisfies EnvReaderSource)
    ).toBe(false);
    expect(
      shouldOptIntoRequestBoundRendering("/dashboard", {
        ERP_CSP_STRATEGY: "hybrid",
        NODE_ENV: "production",
      } satisfies EnvReaderSource)
    ).toBe(true);
  });

  it("requires protected layout connection unless strategy is full sri", () => {
    expect(
      requiresProtectedLayoutConnection({
        ERP_CSP_STRATEGY: "hybrid",
      } satisfies EnvReaderSource)
    ).toBe(true);
    expect(
      requiresProtectedLayoutConnection({
        ERP_CSP_STRATEGY: "nonce",
      } satisfies EnvReaderSource)
    ).toBe(true);
    expect(
      requiresProtectedLayoutConnection({
        ERP_CSP_STRATEGY: "sri",
      } satisfies EnvReaderSource)
    ).toBe(false);
  });
});
