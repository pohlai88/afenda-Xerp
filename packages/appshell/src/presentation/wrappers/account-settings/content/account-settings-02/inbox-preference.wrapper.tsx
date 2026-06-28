"use client";

import { AppShellAccountSettings02InboxPreference as GovernedInboxPreference } from "../../../../blocks/account-settings-02/content/app-shell-account-settings-02-inbox-preference";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings02InboxPreference =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedInboxPreference,
  });
