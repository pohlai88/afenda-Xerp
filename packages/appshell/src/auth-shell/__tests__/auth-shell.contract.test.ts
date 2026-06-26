import { describe, expect, it } from "vitest";

import {
  AUTH_SHELL_BRAND_MANIFESTO,
  AUTH_SHELL_BRAND_PRINCIPLES,
  AUTH_SHELL_BRAND_READINESS_LABEL,
  AUTH_SHELL_ENTRY_CAPABILITIES,
  AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION,
  AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW,
  AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING,
  AUTH_SHELL_ENTRY_FORM_HEADING_ID,
  AUTH_SHELL_ENTRY_PREVIEW_ALT,
  AUTH_SHELL_ENTRY_PREVIEW_SRC,
  AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL,
  AUTH_SHELL_FORM_SKIP_TARGET_ID,
} from "../auth-shell.contract.js";

describe("auth-shell.contract", () => {
  it("keeps serializable default copy constants", () => {
    expect(AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING).toBe(
      "Initialize your operating session."
    );
    expect(AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION).toMatch(/Afenda ERP/);
    expect(AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW).toMatch(/Access Lane/);
    expect(AUTH_SHELL_ENTRY_CAPABILITIES).toHaveLength(3);
    expect(AUTH_SHELL_BRAND_MANIFESTO).toMatch(/invitation/);
    expect(AUTH_SHELL_ENTRY_PREVIEW_SRC).toBe("/auth/auth-entry-preview.png");
    expect(AUTH_SHELL_ENTRY_PREVIEW_ALT).toMatch(/workspace preview/);
    expect(AUTH_SHELL_FORM_SKIP_TARGET_ID).toBe("auth-shell-form");
    expect(AUTH_SHELL_ENTRY_FORM_HEADING_ID).toBe("auth-shell-form-heading");
  });

  it("uses sentence case for the default retry action label", () => {
    expect(AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL).toBe("Try again");
  });

  it("keeps governed memory gate principles as typed editorial data", () => {
    expect(AUTH_SHELL_BRAND_READINESS_LABEL).toBe("Gateway readiness");
    expect(AUTH_SHELL_BRAND_PRINCIPLES).toHaveLength(3);
    expect(AUTH_SHELL_BRAND_PRINCIPLES[0]).toEqual({
      label: "Principle 01",
      statement: "One shell, every lane.",
    });
    expect(
      AUTH_SHELL_BRAND_PRINCIPLES.map((principle) => principle.label)
    ).toEqual(["Principle 01", "Principle 02", "Principle 03"]);
  });
});
