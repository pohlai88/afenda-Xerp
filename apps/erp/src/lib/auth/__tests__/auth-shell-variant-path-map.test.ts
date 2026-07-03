import { describe, expect, it } from "vitest";

import {
  AUTH_PATHS,
  resolveAuthShellVariantForPath,
} from "../auth-path.registry";

describe("auth shell variant path map", () => {
  it("maps canonical auth paths to expected shell variants", () => {
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.signIn)).toBe(
      "login-page-04"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.signUp)).toBe(
      "login-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.verifyEmail.root)).toBe(
      "login-page-02"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.forgotPassword)).toBe(
      "login-page-05"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.error)).toBe(
      "login-page-06"
    );
  });

  it("falls back to sign-in variant for unknown path", () => {
    expect(resolveAuthShellVariantForPath("/unknown-auth-path")).toBe(
      "login-page-04"
    );
  });
});
