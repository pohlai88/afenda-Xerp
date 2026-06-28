/**
 * PAS-005A B42n — serializable strangler map for account-settings content slices.
 * Public export → MCP block id → afenda-only wrapper path.
 */

import type {
  PresentationMcpWrapperEntry,
  PresentationMcpWrapperRegistrySummary,
} from "./presentation-mcp-wrapper.types";

const WRAPPER_ROOT =
  "packages/appshell/src/presentation/wrappers/account-settings/content" as const;

export const PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY = [
  {
    publicExportName: "AppShellAccountSettings01ConnectAccount",
    mcpBlockId: "account-settings-01",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-01/connect-account.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings01DangerZone",
    mcpBlockId: "account-settings-01",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-01/danger-zone.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings01EmailPassword",
    mcpBlockId: "account-settings-01",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-01/email-password.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings01PersonalInfo",
    mcpBlockId: "account-settings-01",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-01/personal-info.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings01SocialUrl",
    mcpBlockId: "account-settings-01",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-01/social-url.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings02AllNotifications",
    mcpBlockId: "account-settings-02",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-02/all-notifications.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings02BrowserNotification",
    mcpBlockId: "account-settings-02",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-02/browser-notification.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings02DoNotDisturb",
    mcpBlockId: "account-settings-02",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-02/do-not-disturb.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings02InboxPreference",
    mcpBlockId: "account-settings-02",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-02/inbox-preference.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings03DangerZone",
    mcpBlockId: "account-settings-03",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-03/danger-zone.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings03WorkspaceData",
    mcpBlockId: "account-settings-03",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-03/workspace-data.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings03WorkspaceDetail",
    mcpBlockId: "account-settings-03",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-03/workspace-detail.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings03WorkspaceName",
    mcpBlockId: "account-settings-03",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-03/workspace-name.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings03WorkspaceOrganizations",
    mcpBlockId: "account-settings-03",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-03/workspace-organizations.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings04IntegrationSection",
    mcpBlockId: "account-settings-04",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-04/integration-section.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings06Policy",
    mcpBlockId: "account-settings-06",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-06/policy.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings06User",
    mcpBlockId: "account-settings-06",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-06/user.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettingsPanelSection",
    mcpBlockId: "account-settings-06",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/panel-section.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings07AddOns",
    mcpBlockId: "account-settings-07",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-07/add-ons.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings07AiGateway",
    mcpBlockId: "account-settings-07",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-07/ai-gateway.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings07AllBilling",
    mcpBlockId: "account-settings-07",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-07/all-billing.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings07PaymentMethod",
    mcpBlockId: "account-settings-07",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-07/payment-method.wrapper.tsx`,
  },
  {
    publicExportName: "AppShellAccountSettings07SpendManagement",
    mcpBlockId: "account-settings-07",
    status: "afenda-only",
    wrapperPath: `${WRAPPER_ROOT}/account-settings-07/spend-management.wrapper.tsx`,
  },
] as const satisfies readonly PresentationMcpWrapperEntry[];

export function computePresentationMcpAccountSettingsContentSummary(
  registry: readonly PresentationMcpWrapperEntry[] = PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY
): PresentationMcpWrapperRegistrySummary {
  return {
    entryCount: registry.length,
    delegatingCount: registry.filter((entry) => entry.status === "delegating")
      .length,
    governedComposeCount: registry.filter(
      (entry) => entry.status === "governed-compose"
    ).length,
    afendaOnlyCount: registry.filter((entry) => entry.status === "afenda-only")
      .length,
  };
}
