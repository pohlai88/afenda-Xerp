import { describe, expect, it } from "vitest";

import { AUTH_PATHS } from "../auth-path.registry";
import { AFENDA_AUTH_SESSION_COOKIE_NAME } from "../auth-session-cookie.contract";
import { loadAuthIngressSurfacePage } from "../load-auth-ingress-surface-page.server";

describe("loadAuthIngressSurfacePage", () => {
  it("loads sign-in ingress with slot hydration", () => {
    const data = loadAuthIngressSurfacePage("/sign-in");

    expect(data.kind).toBe("ready");

    if (data.kind !== "ready") {
      return;
    }

    expect(data.surface.surfaceTemplate.surfaceTemplateId).toBe(
      "surface-template.auth-sign-in"
    );
    expect(data.surface.slotHydration?.blockId).toBe("login-page-04");
  });

  it("returns error for unknown ingress path at compile boundary", () => {
    expect(() => loadAuthIngressSurfacePage("/sign-in")).not.toThrow();
    expect(AUTH_PATHS.signIn).toBe("/sign-in");
    expect(AFENDA_AUTH_SESSION_COOKIE_NAME.length).toBeGreaterThan(0);
  });
});
