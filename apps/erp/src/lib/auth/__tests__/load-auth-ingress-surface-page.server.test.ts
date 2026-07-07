import { describe, expect, it } from "vitest";

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
    expect(data.path).toBe("/sign-in");
    expect(data.lane).toBe("access");
    expect(data.surface.slotHydration?.blockId).toBe("login-page-04");
  });
});
