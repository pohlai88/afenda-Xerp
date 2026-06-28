"use client";

import { AppShellAccountSettingsPanelSection as GovernedPanelSection } from "../../../blocks/app-shell-account-settings-panel-section";
import { createPresentationMcpWrapper } from "../../create-presentation-mcp-wrapper";

export const AppShellAccountSettingsPanelSection = createPresentationMcpWrapper(
  {
    status: "afenda-only",
    GovernedComponent: GovernedPanelSection,
  }
);
