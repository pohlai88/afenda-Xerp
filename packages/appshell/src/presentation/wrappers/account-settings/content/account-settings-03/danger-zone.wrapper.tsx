"use client";

import { AppShellAccountSettings03DangerZone as GovernedDangerZone } from "../../../../blocks/account-settings-03/content/app-shell-account-settings-03-danger-zone";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings03DangerZone = createPresentationMcpWrapper(
  {
    status: "afenda-only",
    GovernedComponent: GovernedDangerZone,
  }
);
