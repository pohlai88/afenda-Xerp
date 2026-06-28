"use client";

import { AppShellAccountSettings01EmailPassword as GovernedEmailPassword } from "../../../../blocks/account-settings-01/content/app-shell-account-settings-01-email-password";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings01EmailPassword =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedEmailPassword,
  });
