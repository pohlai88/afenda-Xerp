"use client";

import { AuthShellErrorSurface } from "../../../auth-shell/auth-shell-error-surface.client.js";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type { AuthShellErrorSurfaceProps as AppShellAuthErrorPage02Props } from "../../../auth-shell/auth-shell.types.js";

export const AppShellAuthErrorPage02 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: AuthShellErrorSurface,
});
