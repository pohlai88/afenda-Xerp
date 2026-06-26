import { describe, expect, it } from "vitest";

import {
  AUTH_SHELL_BRAND_HEADLINE,
  AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION,
  AUTH_SHELL_ENTRY_DEFAULT_EYEBROW,
  AUTH_SHELL_ENTRY_DEFAULT_HEADING,
  AUTH_SHELL_FORM_SKIP_TARGET_ID,
  AUTH_SHELL_LANES,
} from "../auth-shell.constants.js";

describe("auth-shell.contract", () => {
  it("exports lane registry without route strings", () => {
    expect(AUTH_SHELL_LANES).toEqual(["access", "verify", "recover", "error"]);
    expect(AUTH_SHELL_ENTRY_DEFAULT_EYEBROW).toBe("Access Lane");
    expect(AUTH_SHELL_ENTRY_DEFAULT_EYEBROW).not.toMatch(/\//);
    expect(AUTH_SHELL_ENTRY_DEFAULT_HEADING).toBe(
      "Initialize your operating session."
    );
    expect(AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION).toMatch(/Afenda ERP/);
    expect(AUTH_SHELL_FORM_SKIP_TARGET_ID).toBe("auth-shell-form");
    expect(AUTH_SHELL_BRAND_HEADLINE).not.toMatch(/\//);
  });
});
