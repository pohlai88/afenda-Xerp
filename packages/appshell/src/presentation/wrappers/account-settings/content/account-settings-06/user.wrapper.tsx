"use client";

import { AppShellAccountSettings06User as GovernedUser } from "../../../../blocks/app-shell-account-settings-06-user";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings06User = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedUser,
});
