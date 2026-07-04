import { describe, expect, it } from "vitest";

import { AUTH_PATHS } from "../auth-path.registry";
import { resolveAuthSurfaceConfig } from "../auth-surface-config.server";

describe("resolveAuthSurfaceConfig", () => {
  it("defaults the post-auth redirect to auth complete", () => {
    expect(resolveAuthSurfaceConfig().nextPath).toBe(
      AUTH_PATHS.postAuthComplete
    );
  });

  it("allows safe internal next paths", () => {
    expect(
      resolveAuthSurfaceConfig({ next: "/workspace?tab=overview" }).nextPath
    ).toBe("/workspace?tab=overview");
  });

  it("rejects unsafe next paths", () => {
    expect(
      resolveAuthSurfaceConfig({ next: "https://example.com" }).nextPath
    ).toBe(AUTH_PATHS.postAuthComplete);
    expect(resolveAuthSurfaceConfig({ next: "//example.com" }).nextPath).toBe(
      AUTH_PATHS.postAuthComplete
    );
  });
});
