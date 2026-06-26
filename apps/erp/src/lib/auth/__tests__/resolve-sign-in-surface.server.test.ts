import { resolveSignInProviderSurface } from "@afenda/auth";
import { describe, expect, it } from "vitest";

import { resolveSignInSurface } from "../resolve-sign-in-surface.server.js";

describe("resolveSignInSurface", () => {
  it("delegates to @afenda/auth sign-in surface resolver", () => {
    expect(resolveSignInSurface()).toEqual(
      resolveSignInProviderSurface(process.env)
    );
  });
});
