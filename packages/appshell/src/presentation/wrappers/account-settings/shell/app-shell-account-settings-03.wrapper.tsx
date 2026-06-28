"use client";

import { AppShellAccountSettings03 as GovernedAppShellAccountSettings03 } from "../../../blocks/app-shell-account-settings-03";
import { createPresentationMcpWrapper } from "../../create-presentation-mcp-wrapper";

export type { AppShellAccountSettings03Props } from "../../../blocks/app-shell-account-settings-03";

export const AppShellAccountSettings03 = createPresentationMcpWrapper({
  status: "afenda-only",
  GovernedComponent: GovernedAppShellAccountSettings03,
});
