"use client";

import { AppShellAccountSettings03WorkspaceOrganizations as GovernedWorkspaceOrganizations } from "../../../../blocks/account-settings-03/content/app-shell-account-settings-03-workspace-organizations";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings03WorkspaceOrganizations =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedWorkspaceOrganizations,
  });
