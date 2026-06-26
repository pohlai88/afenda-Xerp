import { describe, expect, it } from "vitest";

import {
  AUTH_ENTRY_ROUTE_PREFIXES,
  isAuthEntryRoute,
  isPublicRoute,
  PUBLIC_ROUTE_PREFIXES,
} from "../lib/auth/public-routes";
import { resolveSafeInternalPath } from "../lib/auth/resolve-safe-internal-path";

describe("protected route blocking helpers", () => {
  it("treats sign-in, sign-up, and Better Auth API as public", () => {
    for (const prefix of PUBLIC_ROUTE_PREFIXES) {
      expect(isPublicRoute(prefix)).toBe(true);
    }

    expect(isPublicRoute("/api/auth/sign-in/email")).toBe(true);
    expect(isPublicRoute("/sign-in")).toBe(true);
    expect(isPublicRoute("/sign-up")).toBe(true);
    expect(isPublicRoute("/appshell-canvas")).toBe(true);
  });

  it("treats ERP dashboard routes as protected", () => {
    expect(isPublicRoute("/")).toBe(false);
    expect(isPublicRoute("/manufacturing")).toBe(false);
    expect(isPublicRoute("/system-admin")).toBe(false);
  });

  it("identifies auth entry routes for authenticated redirect", () => {
    for (const prefix of AUTH_ENTRY_ROUTE_PREFIXES) {
      expect(isAuthEntryRoute(prefix)).toBe(true);
    }

    expect(isAuthEntryRoute("/appshell-demo")).toBe(false);
    expect(isAuthEntryRoute("/api/auth")).toBe(false);
  });
});

describe("resolveSafeInternalPath", () => {
  it("returns fallback for unsafe redirect targets", () => {
    expect(resolveSafeInternalPath(null)).toBe("/");
    expect(resolveSafeInternalPath("https://evil.example")).toBe("/");
    expect(resolveSafeInternalPath("//evil.example")).toBe("/");
    expect(resolveSafeInternalPath("/\\evil")).toBe("/");
  });

  it("accepts same-origin relative paths", () => {
    expect(resolveSafeInternalPath("/settings/profile")).toBe(
      "/settings/profile"
    );
    expect(resolveSafeInternalPath("  /manufacturing  ")).toBe(
      "/manufacturing"
    );
  });
});
