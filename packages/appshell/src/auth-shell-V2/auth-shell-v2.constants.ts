/**
 * AUTH-SHELL-V2 lane registry.
 *
 * Package-owned lane identifiers — apps map routes to lanes; no ERP route strings here.
 */
export const AUTH_SHELL_LANES = [
  "access",
  "verify",
  "recover",
  "error",
] as const;

export const AUTH_SHELL_V2_FORM_SKIP_TARGET_ID = "auth-shell-v2-form" as const;

export const AUTH_SHELL_V2_ERROR_TITLE_ID =
  "auth-shell-v2-error-title" as const;

export const AUTH_SHELL_V2_ENTRY_FORM_HEADING_ID =
  "auth-shell-v2-form-heading" as const;

/** Default package copy — lane label only; route hrefs live in app registries. */
export const AUTH_SHELL_V2_ENTRY_DEFAULT_EYEBROW = "Access Lane" as const;

export const AUTH_SHELL_V2_ENTRY_DEFAULT_HEADING =
  "Initialize your operating session." as const;

export const AUTH_SHELL_V2_ENTRY_DEFAULT_DESCRIPTION =
  "Continue with your organization identity to access Afenda ERP." as const;

export const AUTH_SHELL_V2_ERROR_DEFAULT_EYEBROW =
  "Authentication unavailable" as const;

export const AUTH_SHELL_V2_ERROR_DEFAULT_RETRY_LABEL = "Try again" as const;

/** Default brand panel copy — package-owned; apps override via props or route registries. */
export const AUTH_SHELL_V2_BRAND_HEADLINE =
  "Access that feels remembered." as const;

export const AUTH_SHELL_V2_BRAND_SUPPORTING_TEXT =
  "The first controlled moment before every workspace, approval, and operating decision inside Afenda." as const;

export const AUTH_SHELL_V2_BRAND_PRODUCT_LABEL = "Afenda ERP" as const;
