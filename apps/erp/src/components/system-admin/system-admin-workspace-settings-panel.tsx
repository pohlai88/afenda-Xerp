"use client";

import {
  AppShellAccountSettings03,
  type AppShellAccountSettings03TimezoneOption,
} from "@afenda/appshell";
import type { TenantWorkspaceSettings } from "@afenda/database";
import { useActionState, useMemo, useState } from "react";

import { UPDATE_WORKSPACE_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import {
  type UpdateWorkspaceSettingsActionState,
  updateWorkspaceSettingsAction,
} from "@/lib/system-admin/update-workspace-settings.action";

export interface SystemAdminWorkspaceSettingsPanelProps {
  readonly appId: string;
  readonly initialSettings: TenantWorkspaceSettings;
  readonly urlPrefix: string;
}

export function SystemAdminWorkspaceSettingsPanel({
  appId,
  initialSettings,
  urlPrefix,
}: SystemAdminWorkspaceSettingsPanelProps) {
  const [workspaceName, setWorkspaceName] = useState(
    initialSettings.workspaceName
  );
  const [timezoneValue, setTimezoneValue] = useState(initialSettings.timezone);
  const [slug, setSlug] = useState(initialSettings.slug);
  const [description, setDescription] = useState(initialSettings.description);
  const [urlSuffix, setUrlSuffix] = useState(initialSettings.urlSuffix);

  const [actionState, formAction, isPending] = useActionState(
    updateWorkspaceSettingsAction,
    null satisfies UpdateWorkspaceSettingsActionState
  );

  const timezones = useMemo(
    (): AppShellAccountSettings03TimezoneOption[] =>
      Intl.supportedValuesOf("timeZone").map((timezone) => ({
        value: timezone,
        label: timezone.replace(/_/g, " "),
      })),
    []
  );

  const handleSave = () => {
    const formData = new FormData();
    formData.set("intent", UPDATE_WORKSPACE_SETTINGS_INTENT);
    formData.set(
      "payload",
      JSON.stringify({
        workspaceName,
        timezone: timezoneValue,
        slug,
        description,
        urlSuffix,
      })
    );
    formAction(formData);
  };

  return (
    <>
      <AppShellAccountSettings03
        dangerZone={{
          canDeleteWorkspace: false,
          deleteDisabledReason:
            "Workspace deletion requires elevated tenant policy approval.",
        }}
        workspaceData={{
          exports: [],
        }}
        workspaceDetail={{
          description,
          slug,
          urlPrefix,
          urlSuffix,
          onDescriptionChange: setDescription,
          onSave: handleSave,
          onSlugChange: setSlug,
          onUrlSuffixChange: setUrlSuffix,
          pending: isPending,
        }}
        workspaceName={{
          appId,
          onSave: handleSave,
          pending: isPending,
          timezones,
          timezoneValue,
          workspaceName,
          onTimezoneChange: setTimezoneValue,
          onWorkspaceNameChange: setWorkspaceName,
        }}
        workspaceOrganizations={{ organizations: [] }}
      />
      {actionState && !actionState.ok ? (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {actionState.userMessage}
        </p>
      ) : null}
      {actionState?.ok ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          Workspace settings saved.
        </p>
      ) : null}
    </>
  );
}
