"use client";

import { AppShellAccountSettings01PersonalInfo as GovernedPersonalInfo } from "../../../../blocks/account-settings-01/content/app-shell-account-settings-01-personal-info";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings01PersonalInfo =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedPersonalInfo,
  });
