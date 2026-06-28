"use client";

import { AppShellAccountSettings02DoNotDisturb as GovernedDoNotDisturb } from "../../../../blocks/account-settings-02/content/app-shell-account-settings-02-do-not-disturb";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings02DoNotDisturb =
  createPresentationMcpWrapper({
    status: "afenda-only",
    GovernedComponent: GovernedDoNotDisturb,
  });
