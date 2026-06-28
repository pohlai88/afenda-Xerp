"use client";

import { AppShellAccountSettings07SpendManagement as GovernedSpendManagement } from "../../../../blocks/account-settings-07/content/app-shell-account-settings-07-spend-management";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings07SpendManagement =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedSpendManagement,
  });
