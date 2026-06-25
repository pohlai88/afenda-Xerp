"use client";

import {
  AppShellAccountSettings04,
  type AppShellAccountSettings04IntegrationApp,
} from "@afenda/appshell";
import type {
  TenantIntegrationsSettings,
  TenantOAuthProviderId,
  TenantOAuthSettings,
  TenantSsoProviderSummary,
} from "@afenda/database";
import { TENANT_SSO_CLIENT_SECRET_ENV_KEY } from "@afenda/database";
import { Button, Input, Label, Switch } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { UPDATE_INTEGRATIONS_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import {
  type UpdateIntegrationsSettingsActionState,
  updateIntegrationsSettingsAction,
} from "@/lib/system-admin/update-integrations-settings.action";
import {
  type UpdateOauthProviderSettingsActionState,
  updateOauthProviderSettingsAction,
} from "@/lib/system-admin/update-oauth-provider-settings.action";
import {
  type UpdateSsoProviderSettingsActionState,
  updateSsoProviderSettingsAction,
} from "@/lib/system-admin/update-sso-provider-settings.action";

export interface SystemAdminIntegrationsSettingsPanelProps {
  readonly initialIntegrations: TenantIntegrationsSettings;
  readonly initialSsoProviders: readonly TenantSsoProviderSummary[];
}

export type SystemAdminIntegrationsSettingsPanelGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Input" | "Label" | "Switch"
>;

type TenantIntegrationAppRow =
  TenantIntegrationsSettings["communication"]["apps"][number];

type TenantIntegrationSectionKey = "communication" | "planning" | "tools";

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
  initialIntegrations,
  initialSsoProviders,
}: SystemAdminIntegrationsSettingsPanelProps) {
  const router = useRouter();
  const pendingSsoToggleRef = useRef<{
    id: string;
    previousEnabled: boolean;
  } | null>(null);
  const pendingOauthToggleRef = useRef<{
    providerId: TenantOAuthProviderId;
    previousEnabled: boolean;
  } | null>(null);

  const [communicationApps, setCommunicationApps] = useState(() =>
    cloneApps(initialIntegrations.communication.apps)
  );
  const [planningApps, setPlanningApps] = useState(() =>
    cloneApps(initialIntegrations.planning.apps)
  );
  const [toolsApps, setToolsApps] = useState(() =>
    cloneApps(initialIntegrations.tools.apps)
  );
  const [oauthProviders, setOauthProviders] = useState<TenantOAuthSettings>(
    () => ({
      providers: {
        google: { ...initialIntegrations.oauth.providers.google },
        microsoft: { ...initialIntegrations.oauth.providers.microsoft },
      },
    })
  );
  const [ssoProviders, setSsoProviders] = useState(() => [
    ...initialSsoProviders,
  ]);
  const [providerId, setProviderId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [domain, setDomain] = useState("");
  const [issuer, setIssuer] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecretEnvKey, setClientSecretEnvKey] = useState("");

  const [actionState, formAction, isPending] = useActionState(
    updateIntegrationsSettingsAction,
    null satisfies UpdateIntegrationsSettingsActionState
  );

  const [ssoActionState, ssoFormAction, isSsoPending] = useActionState(
    updateSsoProviderSettingsAction,
    null satisfies UpdateSsoProviderSettingsActionState
  );

  const [oauthActionState, oauthFormAction, isOauthPending] = useActionState(
    updateOauthProviderSettingsAction,
    null satisfies UpdateOauthProviderSettingsActionState
  );

  useEffect(() => {
    setOauthProviders({
      providers: {
        google: { ...initialIntegrations.oauth.providers.google },
        microsoft: { ...initialIntegrations.oauth.providers.microsoft },
      },
    });
  }, [initialIntegrations.oauth.providers]);

  useEffect(() => {
    setSsoProviders([...initialSsoProviders]);
  }, [initialSsoProviders]);

  useEffect(() => {
    if (isSsoPending) {
      return;
    }

    if (ssoActionState?.ok) {
      pendingSsoToggleRef.current = null;
      router.refresh();
      return;
    }

    if (ssoActionState && !ssoActionState.ok && pendingSsoToggleRef.current) {
      const pending = pendingSsoToggleRef.current;
      setSsoProviders((current) =>
        current.map((row) =>
          row.id === pending.id
            ? { ...row, enabled: pending.previousEnabled }
            : row
        )
      );
      pendingSsoToggleRef.current = null;
    }
  }, [isSsoPending, router, ssoActionState]);

  useEffect(() => {
    if (isOauthPending) {
      return;
    }

    if (oauthActionState?.ok) {
      pendingOauthToggleRef.current = null;
      router.refresh();
      return;
    }

    if (
      oauthActionState &&
      !oauthActionState.ok &&
      pendingOauthToggleRef.current
    ) {
      const pending = pendingOauthToggleRef.current;
      setOauthProviders((current) => ({
        providers: {
          ...current.providers,
          [pending.providerId]: {
            ...current.providers[pending.providerId],
            enabled: pending.previousEnabled,
          },
        },
      }));
      pendingOauthToggleRef.current = null;
    }
  }, [isOauthPending, oauthActionState, router]);

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
    section: TenantIntegrationSectionKey,
    appId: string,
    connected: boolean
  ) => {
    const nextSettings: TenantIntegrationsSettings = {
      communication: { apps: communicationApps },
      oauth: oauthProviders,
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

  const handleOAuthToggle = (
    providerId: TenantOAuthProviderId,
    enabled: boolean
  ) => {
    pendingOauthToggleRef.current = {
      providerId,
      previousEnabled: oauthProviders.providers[providerId].enabled,
    };

    const formData = new FormData();
    formData.set("mode", "toggle");
    formData.set("providerId", providerId);
    formData.set("enabled", enabled ? "true" : "false");
    oauthFormAction(formData);

    setOauthProviders((current) => ({
      providers: {
        ...current.providers,
        [providerId]: {
          ...current.providers[providerId],
          enabled,
        },
      },
    }));
  };

  const handleSsoToggle = (
    provider: TenantSsoProviderSummary,
    enabled: boolean
  ) => {
    pendingSsoToggleRef.current = {
      id: provider.id,
      previousEnabled: provider.enabled,
    };

    const formData = new FormData();
    formData.set("mode", "toggle");
    formData.set("id", provider.id);
    formData.set("enabled", enabled ? "true" : "false");
    ssoFormAction(formData);

    setSsoProviders((current) =>
      current.map((row) => (row.id === provider.id ? { ...row, enabled } : row))
    );
  };

  const handleSsoUpsert = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("mode", "upsert");
    formData.set(
      "payload",
      JSON.stringify({
        providerId,
        displayName,
        domain,
        issuer,
        enabled: true,
        metadata: {
          clientId,
          ...(clientSecretEnvKey.trim()
            ? { [TENANT_SSO_CLIENT_SECRET_ENV_KEY]: clientSecretEnvKey.trim() }
            : {}),
        },
      })
    );
    ssoFormAction(formData);
  };

  return (
    <>
      <section aria-labelledby="erp-oauth-providers-heading">
        <h2 id="erp-oauth-providers-heading">Social OAuth</h2>
        <p>
          Allowlist Google and Microsoft sign-in per tenant. Client secrets load
          from environment keys — never stored in settings or audit metadata.
        </p>
        <ul>
          {(
            Object.keys(oauthProviders.providers) as TenantOAuthProviderId[]
          ).map((providerId) => {
            const provider = oauthProviders.providers[providerId];
            return (
              <li key={providerId}>
                <span>
                  {provider.displayName} ({providerId})
                </span>
                <Switch
                  checked={provider.enabled}
                  disabled={isOauthPending}
                  onCheckedChange={(checked) => {
                    handleOAuthToggle(providerId, checked);
                  }}
                />
              </li>
            );
          })}
        </ul>
        {oauthActionState && !oauthActionState.ok ? (
          <p className="erp-system-admin-settings-form__message" role="alert">
            {oauthActionState.userMessage}
          </p>
        ) : null}
        {oauthActionState?.ok ? (
          <p className="erp-system-admin-settings-form__message" role="status">
            OAuth provider settings saved.
          </p>
        ) : null}
      </section>
      <section aria-labelledby="erp-sso-providers-heading">
        <h2 id="erp-sso-providers-heading">Enterprise SSO</h2>
        <p>
          Configure tenant-scoped OIDC identity providers. Client secrets are
          loaded from environment keys — never stored in settings or audit
          metadata.
        </p>
        <ul>
          {ssoProviders.map((provider) => (
            <li key={provider.id}>
              <span>
                {provider.displayName} ({provider.providerId}) —{" "}
                {provider.domain}
              </span>
              <Switch
                checked={provider.enabled}
                disabled={isSsoPending}
                onCheckedChange={(checked) => {
                  handleSsoToggle(provider, checked);
                }}
              />
            </li>
          ))}
        </ul>
        <form onSubmit={handleSsoUpsert}>
          <div>
            <Label htmlFor="sso-provider-id">Provider ID</Label>
            <Input
              id="sso-provider-id"
              name="providerId"
              onChange={(event) => {
                setProviderId(event.target.value);
              }}
              required
              value={providerId}
            />
          </div>
          <div>
            <Label htmlFor="sso-display-name">Display name</Label>
            <Input
              id="sso-display-name"
              name="displayName"
              onChange={(event) => {
                setDisplayName(event.target.value);
              }}
              required
              value={displayName}
            />
          </div>
          <div>
            <Label htmlFor="sso-domain">Email domain</Label>
            <Input
              id="sso-domain"
              name="domain"
              onChange={(event) => {
                setDomain(event.target.value);
              }}
              required
              value={domain}
            />
          </div>
          <div>
            <Label htmlFor="sso-issuer">Issuer URL</Label>
            <Input
              id="sso-issuer"
              name="issuer"
              onChange={(event) => {
                setIssuer(event.target.value);
              }}
              required
              type="url"
              value={issuer}
            />
          </div>
          <div>
            <Label htmlFor="sso-client-id">OIDC client ID</Label>
            <Input
              id="sso-client-id"
              name="clientId"
              onChange={(event) => {
                setClientId(event.target.value);
              }}
              required
              value={clientId}
            />
          </div>
          <div>
            <Label htmlFor="sso-client-secret-env">
              Client secret env key (optional)
            </Label>
            <Input
              id="sso-client-secret-env"
              name="clientSecretEnvKey"
              onChange={(event) => {
                setClientSecretEnvKey(event.target.value);
              }}
              value={clientSecretEnvKey}
            />
          </div>
          <Button disabled={isSsoPending} intent="primary" type="submit">
            Save SSO provider
          </Button>
        </form>
        {ssoActionState && !ssoActionState.ok ? (
          <p className="erp-system-admin-settings-form__message" role="alert">
            {ssoActionState.userMessage}
          </p>
        ) : null}
        {ssoActionState?.ok ? (
          <p className="erp-system-admin-settings-form__message" role="status">
            {ssoActionState.data.syncNotice ??
              "SSO provider saved and synced with Better Auth."}
          </p>
        ) : null}
      </section>
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
