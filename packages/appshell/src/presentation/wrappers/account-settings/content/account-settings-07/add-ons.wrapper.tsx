"use client";

import { AppShellAccountSettings07AddOns as GovernedAddOns } from "../../../../blocks/account-settings-07/content/app-shell-account-settings-07-add-ons";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings07AddOns = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAddOns,
});
