import { describe, expect, it } from "vitest";

import {
  isProtectedAppRouterPath,
  PROTECTED_APP_ROUTER_PATH_PREFIXES,
} from "../auth-protected-surface.registry";

describe("auth-protected-surface.registry path guards", () => {
  it("treats skeleton protected prefixes as protected", () => {
    for (const prefix of PROTECTED_APP_ROUTER_PATH_PREFIXES) {
      expect(isProtectedAppRouterPath(prefix)).toBe(true);
    }
  });

  it("allows public home and auth entry paths", () => {
    expect(isProtectedAppRouterPath("/")).toBe(false);
    expect(isProtectedAppRouterPath("/sign-in")).toBe(false);
    expect(isProtectedAppRouterPath("/api/auth/session")).toBe(false);
  });

  it("guards metadata workspace nested paths", () => {
    expect(isProtectedAppRouterPath("/metadata-workspace/review")).toBe(true);
  });
});
