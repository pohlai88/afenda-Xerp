import { describe, expect, it } from "vitest";

import { AUTH_PATHS } from "../auth-path.registry";
import { resolveUnauthenticatedRedirectPath } from "../resolve-unauthenticated-redirect-path";

describe("resolveUnauthenticatedRedirectPath", () => {
  it("routes signed-out visitors to sign-in when session cookie is absent", () => {
    expect(resolveUnauthenticatedRedirectPath(null)).toBe(AUTH_PATHS.signIn);
    expect(resolveUnauthenticatedRedirectPath(undefined)).toBe(
      AUTH_PATHS.signIn
    );
    expect(resolveUnauthenticatedRedirectPath("")).toBe(AUTH_PATHS.signIn);
  });

  it("routes stale Better Auth session cookies to session-expired", () => {
    expect(resolveUnauthenticatedRedirectPath("signed-token")).toBe(
      AUTH_PATHS.sessionExpired
    );
  });
});
