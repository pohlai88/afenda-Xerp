"use client";

import {
  AppShellAccountSettings04,
  type AppShellAccountSettings04IntegrationApp,
} from "@afenda/appshell";
import type { TenantIntegrationsSettings } from "@afenda/database";
import { useActionState, useCallback, useState } from "react";

import { UPDATE_INTEGRATIONS_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import {
  type UpdateIntegrationsSettingsActionState,
  updateIntegrationsSettingsAction,
} from "@/lib/system-admin/update-integrations-settings.action";

export interface SystemAdminIntegrationsSettingsPanelProps {
  readonly initialSettings: TenantIntegrationsSettings;
}

type TenantIntegrationAppRow =
  TenantIntegrationsSettings[keyof TenantIntegrationsSettings]["apps"][number];

function toIntegrationApp(
  app: TenantIntegrationAppRow
): AppShellAccountSettings04IntegrationApp {
  const base: AppShellAccountSettings04IntegrationApp = {
    connected: app.connected,
    description: app.description,
    id: app.id,
    name: app.name,
  };

  return app.pricingLabel === undefined
    ? base
    : { ...base, pricingLabel: app.pricingLabel };
}

function cloneApps(
  apps: readonly TenantIntegrationAppRow[]
): AppShellAccountSettings04IntegrationApp[] {
  return apps.map(toIntegrationApp);
}

export function SystemAdminIntegrationsSettingsPanel({
  initialSettings,
}: SystemAdminIntegrationsSettingsPanelProps) {
  const [communicationApps, setCommunicationApps] = useState(() =>
    cloneApps(initialSettings.communication.apps)
  );
  const [planningApps, setPlanningApps] = useState(() =>
    cloneApps(initialSettings.planning.apps)
  );
  const [toolsApps, setToolsApps] = useState(() =>
    cloneApps(initialSettings.tools.apps)
  );

  const [actionState, formAction, isPending] = useActionState(
    updateIntegrationsSettingsAction,
    null satisfies UpdateIntegrationsSettingsActionState
  );

  const persistSettings = useCallback(
    (next: TenantIntegrationsSettings) => {
      const formData = new FormData();
      formData.set("intent", UPDATE_INTEGRATIONS_SETTINGS_INTENT);
      formData.set("payload", JSON.stringify(next));
      formAction(formData);
    },
    [formAction]
  );

  const handleConnectToggle = (
    section: keyof TenantIntegrationsSettings,
    appId: string,
    connected: boolean
  ) => {
    const nextSettings: TenantIntegrationsSettings = {
      communication: { apps: communicationApps },
      planning: { apps: planningApps },
      tools: { apps: toolsApps },
    };

    const updateApps = (
      apps: AppShellAccountSettings04IntegrationApp[]
    ): AppShellAccountSettings04IntegrationApp[] =>
      apps.map((app) => (app.id === appId ? { ...app, connected } : app));

    if (section === "communication") {
      const nextApps = updateApps(communicationApps);
      setCommunicationApps(nextApps);
      nextSettings.communication = { apps: nextApps };
    } else if (section === "planning") {
      const nextApps = updateApps(planningApps);
      setPlanningApps(nextApps);
      nextSettings.planning = { apps: nextApps };
    } else {
      const nextApps = updateApps(toolsApps);
      setToolsApps(nextApps);
      nextSettings.tools = { apps: nextApps };
    }

    persistSettings(nextSettings);
  };

  return (
    <>
      <AppShellAccountSettings04
        communication={{
          title: "Communications",
          description: "Manage your communication integrations and settings.",
          apps: communicationApps,
          pending: isPending,
          onConnectToggle: (appId, connected) => {
            handleConnectToggle("communication", appId, connected);
          },
        }}
        planning={{
          title: "Planning & productivity",
          description: "Connect planning and documentation tools.",
          apps: planningApps,
          pending: isPending,
          onConnectToggle: (appId, connected) => {
            handleConnectToggle("planning", appId, connected);
          },
        }}
        tools={{
          title: "Tools",
          description: "Developer and automation integrations.",
          apps: toolsApps,
          pending: isPending,
          onConnectToggle: (appId, connected) => {
            handleConnectToggle("tools", appId, connected);
          },
        }}
      />
      {actionState && !actionState.ok ? (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {actionState.userMessage}
        </p>
      ) : null}
      {actionState?.ok ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          Integration settings saved.
        </p>
      ) : null}
    </>
  );
}
