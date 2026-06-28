"use client";

import { AppShellAccountSettings04IntegrationSection as GovernedIntegrationSection } from "../../../../blocks/account-settings-04/content/app-shell-account-settings-04-integration-section";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings04IntegrationSection =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedIntegrationSection,
  });
