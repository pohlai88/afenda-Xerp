"use client";

import { AppShellAccountSettings03WorkspaceDetail as GovernedWorkspaceDetail } from "../../../../blocks/account-settings-03/content/app-shell-account-settings-03-workspace-detail";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings03WorkspaceDetail =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedWorkspaceDetail,
  });
