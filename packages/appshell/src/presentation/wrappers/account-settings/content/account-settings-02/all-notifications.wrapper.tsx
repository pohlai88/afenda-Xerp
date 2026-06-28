"use client";

import { AppShellAccountSettings02AllNotifications as GovernedAllNotifications } from "../../../../blocks/account-settings-02/content/app-shell-account-settings-02-all-notifications";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings02AllNotifications =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedAllNotifications,
  });
