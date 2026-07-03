import { describe, expect, it } from "vitest";

import LoginPage04 from "../../components-auth-shell/login-page-04.js";
import { resolveAuthShell } from "../../components-auth-shell/resolve-auth-shell.js";

describe("resolveAuthShell", () => {
  it("resolves access lane to login-page-04 block", () => {
    expect(resolveAuthShell("access")).toBe(LoginPage04);
  });

  it("falls back to access block for unregistered lanes", () => {
    expect(resolveAuthShell("verify")).toBe(LoginPage04);
    expect(resolveAuthShell("recover")).toBe(LoginPage04);
    expect(resolveAuthShell("error")).toBe(LoginPage04);
  });
});
