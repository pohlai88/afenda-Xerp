"use client";

import { AppShellAccountSettings07AllBilling as GovernedAllBilling } from "../../../../blocks/account-settings-07/content/app-shell-account-settings-07-all-billing";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings07AllBilling = createPresentationMcpWrapper(
  {
    status: "afenda-only",
    GovernedComponent: GovernedAllBilling,
  }
);
