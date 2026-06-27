import { describe, expect, it } from "vitest";

import * as authShell from "../auth-shell/index.js";
import * as appshell from "../index.js";

describe("@afenda/appshell/auth-shell", () => {
  it("exports stable auth shell surface names", () => {
    expect(Object.keys(authShell).sort()).toEqual([
      "AUTH_SHELL_BRAND_HEADLINE",
      "AUTH_SHELL_BRAND_PRODUCT_LABEL",
      "AUTH_SHELL_BRAND_SUPPORTING_TEXT",
      "AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION",
      "AUTH_SHELL_ENTRY_DEFAULT_EYEBROW",
      "AUTH_SHELL_ENTRY_DEFAULT_HEADING",
      "AUTH_SHELL_ENTRY_FORM_HEADING_ID",
      "AUTH_SHELL_ERROR_DEFAULT_EYEBROW",
      "AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL",
      "AUTH_SHELL_ERROR_TITLE_ID",
      "AUTH_SHELL_FORM_SKIP_TARGET_ID",
      "AUTH_SHELL_LANES",
      "AppShellAuthErrorPage02",
      "AppShellAuthLoginPage04",
      "AuthShell",
      "AuthShellAlternateAction",
      "AuthShellBrandHeader",
      "AuthShellBrandPanel",
      "AuthShellEntryPage",
      "AuthShellErrorEntryPage",
      "AuthShellErrorSurface",
      "AuthShellErrorSurfaceWithRetry",
      "AuthShellEscapeAction",
      "AuthShellFormFrame",
      "AuthShellLegalNotice",
      "AuthShellStatusSurface",
      "AuthShellVisualPanel",
    ]);
  });

  it("re-exports deprecated auth aliases from root barrel for backward compatibility", () => {
    expect(appshell.AppShellAuthLoginPage04).toBe(authShell.AuthShellEntryPage);
    expect(appshell.AppShellAuthErrorPage02).toBe(
      authShell.AuthShellErrorSurface
    );
  });
});
