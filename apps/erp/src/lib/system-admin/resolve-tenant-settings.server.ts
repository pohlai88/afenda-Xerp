import {
  AUTH_SHELL_BRAND_HEADLINE,
  AUTH_SHELL_BRAND_SUPPORTING_TEXT,
} from "@afenda/appshell/auth-shell";
import {
  buildDefaultTenantAppearanceSettings,
  buildDefaultTenantOAuthSettings,
  getTenantSettingsByTenantId,
  type TenantAppearanceSettings,
  type TenantBillingSettings,
  type TenantIntegrationsSettings,
  type TenantNotificationsSettings,
  type TenantWorkspaceSettings,
} from "@afenda/database";
import { unstable_noStore as noStore } from "next/cache";

import { resolveSystemAdminSectionAccess } from "./resolve-system-admin-section-access.server";
import {
  buildCommunicationIntegrations,
  buildPlanningIntegrations,
  buildToolsIntegrations,
  SYSTEM_ADMIN_BILLING_ADD_ONS,
  SYSTEM_ADMIN_BROWSER_NOTIFICATION_ITEMS,
  SYSTEM_ADMIN_DND_WEEK_DAYS,
  SYSTEM_ADMIN_INBOX_PREFERENCE_ITEMS,
  SYSTEM_ADMIN_NOTIFICATION_SECTIONS,
} from "./system-admin-settings-blocks.contract";

export function buildDefaultNotificationsSettings(): TenantNotificationsSettings {
  return {
    sections: SYSTEM_ADMIN_NOTIFICATION_SECTIONS.map((section) => ({
      id: section.id,
      title: section.title,
      items: section.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? "",
        channels: { ...item.channels },
      })),
    })),
    inboxItems: SYSTEM_ADMIN_INBOX_PREFERENCE_ITEMS.map((item) => ({
      ...item,
    })),
    browserItems: SYSTEM_ADMIN_BROWSER_NOTIFICATION_ITEMS.map((item) => ({
      ...item,
    })),
    playSoundOnBlink: false,
    dndEnabled: false,
    fromTime: "01:30",
    toTime: "02:30",
    daysOff: ["saturday"],
  };
}

export function buildDefaultWorkspaceSettings(input: {
  readonly workspaceName: string;
  readonly timezone: string;
}): TenantWorkspaceSettings {
  return {
    workspaceName: input.workspaceName,
    timezone: input.timezone,
    slug: "",
    description: "",
    urlSuffix: "",
  };
}

export function buildDefaultBillingSettings(): TenantBillingSettings {
  return {
    spendEnabled: true,
    setAmount: "350",
    notificationEmail: "",
    addOns: SYSTEM_ADMIN_BILLING_ADD_ONS.map((addOn) => ({ ...addOn })),
    selectedPreset: "$25",
    customAmount: "",
    autoPayEnabled: false,
  };
}

export function buildDefaultIntegrationsSettings(): TenantIntegrationsSettings {
  return {
    communication: {
      apps: buildCommunicationIntegrations().map((app) => ({ ...app })),
    },
    oauth: buildDefaultTenantOAuthSettings(),
    planning: {
      apps: buildPlanningIntegrations().map((app) => ({ ...app })),
    },
    tools: {
      apps: buildToolsIntegrations().map((app) => ({ ...app })),
    },
  };
}

export async function resolveNotificationsSettings(): Promise<TenantNotificationsSettings> {
  const access = await resolveSystemAdminSectionAccess("settings");
  if (access.kind !== "allowed") {
    return buildDefaultNotificationsSettings();
  }

  const persisted = await getTenantSettingsByTenantId(
    access.operatingContext.tenant.tenantId
  );
  if (persisted?.notifications) {
    return persisted.notifications;
  }

  return buildDefaultNotificationsSettings();
}

export async function resolveWorkspaceSettings(input: {
  readonly fallbackTimezone: string;
  readonly fallbackWorkspaceName: string;
}): Promise<TenantWorkspaceSettings> {
  const access = await resolveSystemAdminSectionAccess("settings");
  if (access.kind !== "allowed") {
    return buildDefaultWorkspaceSettings({
      workspaceName: input.fallbackWorkspaceName,
      timezone: input.fallbackTimezone,
    });
  }

  const persisted = await getTenantSettingsByTenantId(
    access.operatingContext.tenant.tenantId
  );
  if (persisted?.workspace) {
    return persisted.workspace;
  }

  return buildDefaultWorkspaceSettings({
    workspaceName:
      access.operatingContext.tenant.displayName || input.fallbackWorkspaceName,
    timezone: input.fallbackTimezone,
  });
}

export async function resolveBillingSettings(): Promise<TenantBillingSettings> {
  const access = await resolveSystemAdminSectionAccess("settings");
  if (access.kind !== "allowed") {
    return buildDefaultBillingSettings();
  }

  const persisted = await getTenantSettingsByTenantId(
    access.operatingContext.tenant.tenantId
  );
  if (persisted?.billing) {
    return persisted.billing;
  }

  return buildDefaultBillingSettings();
}

export function buildDefaultAppearanceSettings(input: {
  readonly productLabel: string;
}): TenantAppearanceSettings {
  return {
    ...buildDefaultTenantAppearanceSettings({
      productLabel: input.productLabel,
    }),
    headline: AUTH_SHELL_BRAND_HEADLINE,
    supportingText: AUTH_SHELL_BRAND_SUPPORTING_TEXT,
  };
}

export async function resolveAppearanceSettings(input: {
  readonly fallbackProductLabel: string;
}): Promise<TenantAppearanceSettings> {
  noStore();
  const access = await resolveSystemAdminSectionAccess("settings");
  if (access.kind !== "allowed") {
    return buildDefaultAppearanceSettings({
      productLabel: input.fallbackProductLabel,
    });
  }

  const persisted = await getTenantSettingsByTenantId(
    access.operatingContext.tenant.tenantId
  );
  if (persisted?.appearance) {
    return persisted.appearance;
  }

  return buildDefaultAppearanceSettings({
    productLabel:
      access.operatingContext.tenant.displayName || input.fallbackProductLabel,
  });
}

export async function resolveIntegrationsSettings(): Promise<TenantIntegrationsSettings> {
  noStore();
  const access = await resolveSystemAdminSectionAccess("settings");
  if (access.kind !== "allowed") {
    return buildDefaultIntegrationsSettings();
  }

  const persisted = await getTenantSettingsByTenantId(
    access.operatingContext.tenant.tenantId
  );
  if (persisted?.integrations) {
    return persisted.integrations;
  }

  return buildDefaultIntegrationsSettings();
}

export function buildNotificationsWeekDays() {
  return SYSTEM_ADMIN_DND_WEEK_DAYS.map((day) => ({ ...day }));
}
