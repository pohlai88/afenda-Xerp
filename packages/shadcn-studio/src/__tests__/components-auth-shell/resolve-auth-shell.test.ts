import { describe, expect, it } from "vitest";

import { LOGIN_PAGE_BLOCK_IDS } from "../../components-auth-shell/auth-shell-method-manifest.js";
import ForgotPasswordPage01 from "../../components-auth-shell/forgot-password-page-01.js";
import LoginPage02 from "../../components-auth-shell/login-page-02.js";
import LoginPage04 from "../../components-auth-shell/login-page-04.js";
import LoginPage06 from "../../components-auth-shell/login-page-06.js";
import {
  AUTH_SHELL_LANE_DEFAULT_PAGE_MAP,
  resolveAuthShell,
} from "../../components-auth-shell/resolve-auth-shell.js";

describe("resolve auth shell", () => {
  it("owns the auth lane default page selection", () => {
    expect(AUTH_SHELL_LANE_DEFAULT_PAGE_MAP).toEqual({
      access: "login-page-04",
      verify: "login-page-02",
      recover: "forgot-password-page-01",
      error: "login-page-06",
    });
  });

  it("resolves each auth lane to the expected login shell", () => {
    expect(resolveAuthShell()).toBe(LoginPage04);
    expect(resolveAuthShell("access")).toBe(LoginPage04);
    expect(resolveAuthShell("verify")).toBe(LoginPage02);
    expect(resolveAuthShell("recover")).toBe(ForgotPasswordPage01);
    expect(resolveAuthShell("error")).toBe(LoginPage06);
  });

  it("keeps LoginPage07 outside the six governed login page ids", () => {
    expect(LOGIN_PAGE_BLOCK_IDS).toEqual([
      "login-page-01",
      "login-page-02",
      "login-page-03",
      "login-page-04",
      "login-page-05",
      "login-page-06",
    ]);
    expect(LOGIN_PAGE_BLOCK_IDS).not.toContain("login-page-07");
  });
});
