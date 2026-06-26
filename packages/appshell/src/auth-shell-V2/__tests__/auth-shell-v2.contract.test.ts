import { describe, expect, it } from "vitest";

import {
  AUTH_SHELL_LANES,
  AUTH_SHELL_V2_BRAND_HEADLINE,
  AUTH_SHELL_V2_ENTRY_DEFAULT_DESCRIPTION,
  AUTH_SHELL_V2_ENTRY_DEFAULT_EYEBROW,
  AUTH_SHELL_V2_ENTRY_DEFAULT_HEADING,
  AUTH_SHELL_V2_FORM_SKIP_TARGET_ID,
} from "../auth-shell-v2.constants.js";

describe("auth-shell-v2.contract", () => {
  it("exports lane registry without route strings", () => {
    expect(AUTH_SHELL_LANES).toEqual(["access", "verify", "recover", "error"]);
    expect(AUTH_SHELL_V2_ENTRY_DEFAULT_EYEBROW).toBe("Access Lane");
    expect(AUTH_SHELL_V2_ENTRY_DEFAULT_EYEBROW).not.toMatch(/\//);
    expect(AUTH_SHELL_V2_ENTRY_DEFAULT_HEADING).toBe(
      "Initialize your operating session."
    );
    expect(AUTH_SHELL_V2_ENTRY_DEFAULT_DESCRIPTION).toMatch(/Afenda ERP/);
    expect(AUTH_SHELL_V2_FORM_SKIP_TARGET_ID).toBe("auth-shell-v2-form");
    expect(AUTH_SHELL_V2_BRAND_HEADLINE).not.toMatch(/\//);
  });
});
