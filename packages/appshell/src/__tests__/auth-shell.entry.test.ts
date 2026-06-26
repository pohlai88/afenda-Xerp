import { describe, expect, it } from "vitest";

import * as authShell from "../auth-shell/index.js";
import * as appshell from "../index.js";

describe("@afenda/appshell/auth-shell", () => {
  it("exports stable auth shell surface names", () => {
    expect(Object.keys(authShell).sort()).toEqual([
      "AUTH_SHELL_BRAND_ARTIFACT_ALT",
      "AUTH_SHELL_BRAND_ARTIFACT_SRC",
      "AUTH_SHELL_BRAND_DESCRIPTION",
      "AUTH_SHELL_BRAND_FOOTER_COPY",
      "AUTH_SHELL_BRAND_HEADLINE",
      "AUTH_SHELL_BRAND_HEADLINE_EMPHASIS",
      "AUTH_SHELL_BRAND_KICKER",
      "AUTH_SHELL_BRAND_MANIFESTO",
      "AUTH_SHELL_BRAND_PRINCIPLES",
      "AUTH_SHELL_BRAND_PRODUCT_LABEL",
      "AUTH_SHELL_BRAND_READINESS_LABEL",
      "AUTH_SHELL_BRAND_READINESS_SCORE",
      "AUTH_SHELL_BRAND_SECURITY_LABEL",
      "AUTH_SHELL_BRAND_SUPPORTING_TEXT",
      "AUTH_SHELL_BRAND_TITLE",
      "AUTH_SHELL_ENTRY_CAPABILITIES",
      "AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION",
      "AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW",
      "AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING",
      "AUTH_SHELL_ENTRY_FORM_HEADING_ID",
      "AUTH_SHELL_ENTRY_PREVIEW_ALT",
      "AUTH_SHELL_ENTRY_PREVIEW_CAPTION",
      "AUTH_SHELL_ENTRY_PREVIEW_SRC",
      "AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL",
      "AUTH_SHELL_ERROR_EYEBROW",
      "AUTH_SHELL_ERROR_TITLE_ID",
      "AUTH_SHELL_FORM_SKIP_TARGET_ID",
      "AppShellAuthErrorPage02",
      "AppShellAuthLoginPage04",
      "AuthShellBrandArtifactImage",
      "AuthShellBrandArtifactPlane",
      "AuthShellEntry",
      "AuthShellEntryBrand",
      "AuthShellEntryBrandPanel",
      "AuthShellEntryPage",
      "AuthShellError",
      "AuthShellErrorSurface",
      "AuthShellPreviewImage",
    ]);
  });

  it("re-exports deprecated auth aliases from root barrel for backward compatibility", () => {
    expect(appshell.AppShellAuthLoginPage04).toBe(authShell.AuthShellEntryPage);
    expect(appshell.AppShellAuthErrorPage02).toBe(
      authShell.AuthShellErrorSurface
    );
  });
});
