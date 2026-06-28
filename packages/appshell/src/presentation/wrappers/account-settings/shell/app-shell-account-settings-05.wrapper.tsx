"use client";

import { AppShellAccountSettings05 as GovernedAppShellAccountSettings05 } from "../../../blocks/app-shell-account-settings-05";
import { createPresentationMcpWrapper } from "../../create-presentation-mcp-wrapper";

export type { AppShellAccountSettings05Props } from "../../../blocks/app-shell-account-settings-05";

export const AppShellAccountSettings05 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAppShellAccountSettings05,
});
