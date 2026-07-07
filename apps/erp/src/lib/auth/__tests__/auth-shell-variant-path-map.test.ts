import { describe, expect, it } from "vitest";

import { resolveAuthShellVariantForPath } from "../auth-path.registry";

describe("auth shell variant path map", () => {
  it("falls back to sign-in variant for unknown path", () => {
    expect(resolveAuthShellVariantForPath("/unknown-auth-path")).toBe(
      "login-page-04"
    );
  });
});
