export {
  AUTH_SHELL_BRAND_HEADLINE,
  AUTH_SHELL_BRAND_PRODUCT_LABEL,
  AUTH_SHELL_BRAND_SUPPORTING_TEXT,
  AUTH_SHELL_ENTRY_DEFAULT_DESCRIPTION,
  AUTH_SHELL_ENTRY_DEFAULT_EYEBROW,
  AUTH_SHELL_ENTRY_DEFAULT_HEADING,
  AUTH_SHELL_ENTRY_FORM_HEADING_ID,
  AUTH_SHELL_ERROR_DEFAULT_EYEBROW,
  AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL,
  AUTH_SHELL_ERROR_TITLE_ID,
  AUTH_SHELL_FORM_SKIP_TARGET_ID,
  AUTH_SHELL_LANES,
} from "./auth-shell.constants.js";
export {
  AuthShell,
  AuthShellAlternateAction,
  AuthShellBrandPanel,
  AuthShellEscapeAction,
  AuthShellFormFrame,
  AuthShellLegalNotice,
  AuthShellStatusSurface,
  AuthShellVisualPanel,
} from "./auth-shell.js";
/** @deprecated Use `AuthShellEntryPageProps` from `@afenda/appshell/auth-shell`. */
/** @deprecated Use `AuthShellErrorSurfaceProps` from `@afenda/appshell/auth-shell`. */
export type {
  AuthShellBrandCopy,
  AuthShellBrandPanelProps,
  AuthShellEntryFormHeaderProps,
  AuthShellEntryLane,
  AuthShellEntryPageProps,
  AuthShellEntryPageProps as AppShellAuthLoginPage04Props,
  AuthShellErrorEntryPageProps,
  AuthShellErrorSurfaceProps,
  AuthShellErrorSurfaceProps as AppShellAuthErrorPage02Props,
  AuthShellErrorTone,
  AuthShellFormFrameProps,
  AuthShellLane,
  AuthShellProps,
  AuthShellSerializableCopy,
  AuthShellSlotProps,
  AuthShellStatusHeadingLevel,
  AuthShellStatusSurfaceProps,
  AuthShellStatusTone,
  AuthShellVisualPanelProps,
} from "./auth-shell.types.js";
export { AuthShellBrandHeader } from "./auth-shell-brand-header.js";
/** @deprecated Use `AuthShellEntryPage` from `@afenda/appshell/auth-shell`. */
export {
  AuthShellEntryPage,
  AuthShellEntryPage as AppShellAuthLoginPage04,
  AuthShellErrorEntryPage,
} from "./auth-shell-entry-layout.js";
export type { AuthShellErrorSurfaceLegacyRetryProps } from "./auth-shell-error-surface.client.js";
/** @deprecated Use `AuthShellErrorSurface` from `@afenda/appshell/auth-shell`. */
export {
  AuthShellErrorSurface,
  AuthShellErrorSurface as AppShellAuthErrorPage02,
  AuthShellErrorSurfaceWithRetry,
} from "./auth-shell-error-surface.client.js";
