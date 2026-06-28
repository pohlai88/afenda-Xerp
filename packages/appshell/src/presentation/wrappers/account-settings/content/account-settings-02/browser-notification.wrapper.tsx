"use client";

import { AppShellAccountSettings02BrowserNotification as GovernedBrowserNotification } from "../../../../blocks/account-settings-02/content/app-shell-account-settings-02-browser-notification";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings02BrowserNotification =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedBrowserNotification,
  });
