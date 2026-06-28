"use client";

import { AppShellAccountSettings03WorkspaceName as GovernedWorkspaceName } from "../../../../blocks/account-settings-03/content/app-shell-account-settings-03-workspace-name";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings03WorkspaceName =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedWorkspaceName,
  });
