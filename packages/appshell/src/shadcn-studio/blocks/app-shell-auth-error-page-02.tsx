/**
 * @deprecated Import from `@afenda/appshell/auth-shell` instead.
 */
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import type { AuthShellErrorSurfaceProps } from "../../auth-shell/auth-shell.types.js";

export type AuthShellErrorGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

export type AppShellAuthErrorPage02GovernedComponents =
  AuthShellErrorGovernedComponents;

export { AuthShellErrorSurface as AppShellAuthErrorPage02 } from "../../auth-shell/auth-shell-error-surface.client.js";
export type {
  AuthShellErrorSurfaceProps,
  AuthShellErrorSurfaceProps as AppShellAuthErrorPage02Props,
};
