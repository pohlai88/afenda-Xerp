"use client";

import { AuthShellEntryPage } from "../../../auth-shell/auth-shell-entry-layout.js";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type { AuthShellEntryPageProps as AppShellAuthLoginPage04Props } from "../../../auth-shell/auth-shell.types.js";

export const AppShellAuthLoginPage04 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: AuthShellEntryPage,
});
