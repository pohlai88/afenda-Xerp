"use client";

import { AppShellAccountSettings03WorkspaceData as GovernedWorkspaceData } from "../../../../blocks/account-settings-03/content/app-shell-account-settings-03-workspace-data";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings03WorkspaceData =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedWorkspaceData,
  });
