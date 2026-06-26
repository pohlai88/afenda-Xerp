import { describe, expect, it } from "vitest";
import { AUTH_PATHS, AUTH_SEGMENT_PATHS } from "@/lib/auth/auth-path.registry";
import {
  isAuthEntryRoute,
  isPublicRoute,
  shouldRedirectAuthenticatedUserFromAuthEntry,
} from "@/lib/auth/public-routes";

describe("public-routes", () => {
  it("marks all auth segment paths as public auth entry routes", () => {
    for (const path of AUTH_SEGMENT_PATHS) {
      expect(isAuthEntryRoute(path)).toBe(true);
      expect(isPublicRoute(path)).toBe(true);
    }
  });

  it("does not treat ERP dashboard as auth entry", () => {
    expect(isAuthEntryRoute("/")).toBe(false);
    expect(isAuthEntryRoute("/settings")).toBe(false);
  });

  it("keeps post-auth security routes reachable for authenticated sessions", () => {
    expect(
      shouldRedirectAuthenticatedUserFromAuthEntry(AUTH_PATHS.signIn)
    ).toBe(true);
    expect(
      shouldRedirectAuthenticatedUserFromAuthEntry(AUTH_PATHS.securityReview)
    ).toBe(false);
    expect(shouldRedirectAuthenticatedUserFromAuthEntry(AUTH_PATHS.mfa)).toBe(
      false
    );
    expect(
      shouldRedirectAuthenticatedUserFromAuthEntry(AUTH_PATHS.postAuthComplete)
    ).toBe(false);
  });
});
