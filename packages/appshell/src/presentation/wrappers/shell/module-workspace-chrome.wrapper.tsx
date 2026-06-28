"use client";

import { AppShellModuleWorkspaceChrome as GovernedModuleWorkspaceChrome } from "../../blocks/app-shell-module-workspace-chrome";
import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type { AppShellModuleWorkspaceChromeProps } from "../../blocks/app-shell-module-workspace-chrome";

export const AppShellModuleWorkspaceChrome = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedModuleWorkspaceChrome,
});
