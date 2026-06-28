"use client";

import { AppShellAccountSettings01DangerZone as GovernedDangerZone } from "../../../../blocks/account-settings-01/content/app-shell-account-settings-01-danger-zone";
import { createPresentationMcpWrapper } from "../../../create-presentation-mcp-wrapper";

export const AppShellAccountSettings01DangerZone = createPresentationMcpWrapper(
  {
    status: "afenda-only",
    GovernedComponent: GovernedDangerZone,
  }
);
