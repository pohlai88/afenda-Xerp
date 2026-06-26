"use client";

import {
  AppShellAccountSettings04,
  type AppShellAccountSettings04IntegrationApp,
} from "@afenda/appshell";
import type {
  TenantIntegrationsSettings,
  TenantOAuthProviderId,
  TenantOAuthSettings,
  TenantSsoProtocol,
  TenantSsoProviderSummary,
} from "@afenda/database";
import { TENANT_SSO_CLIENT_SECRET_ENV_KEY } from "@afenda/database";
import {
  Button,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Textarea,
} from "@afenda/ui";
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
  | "Button"
  | "Input"
  | "Label"
  | "RadioGroup"
  | "RadioGroupItem"
  | "Switch"
  | "Textarea"
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
  const [ssoProtocol, setSsoProtocol] = useState<TenantSsoProtocol>("oidc");
  const [providerId, setProviderId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [domain, setDomain] = useState("");
  const [issuer, setIssuer] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecretEnvKey, setClientSecretEnvKey] = useState("");
  const [samlEntryPoint, setSamlEntryPoint] = useState("");
  const [samlCert, setSamlCert] = useState("");
  const [samlIdpMetadataXml, setSamlIdpMetadataXml] = useState("");
  const [rotateOidcEnvKey, setRotateOidcEnvKey] = useState("");
  const [rotateSamlCertValue, setRotateSamlCertValue] = useState("");

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

    if (ssoProtocol === "saml") {
      formData.set(
        "payload",
        JSON.stringify({
          protocol: "saml",
          providerId,
          displayName,
          domain,
          issuer,
          enabled: true,
          metadata: {
            entryPoint: samlEntryPoint,
            cert: samlCert,
            ...(samlIdpMetadataXml.trim()
              ? { idpMetadataXml: samlIdpMetadataXml.trim() }
              : {}),
          },
        })
      );
    } else {
      formData.set(
        "payload",
        JSON.stringify({
          protocol: "oidc",
          providerId,
          displayName,
          domain,
          issuer,
          enabled: true,
          metadata: {
            clientId,
            ...(clientSecretEnvKey.trim()
              ? {
                  [TENANT_SSO_CLIENT_SECRET_ENV_KEY]: clientSecretEnvKey.trim(),
                }
              : {}),
          },
        })
      );
    }

    ssoFormAction(formData);
  };

  const handleSsoRotate = (provider: TenantSsoProviderSummary) => {
    const formData = new FormData();
    formData.set("mode", "rotate");

    if (provider.protocol === "oidc") {
      formData.set(
        "payload",
        JSON.stringify({
          protocol: "oidc",
          id: provider.id,
          clientSecretEnvKey: rotateOidcEnvKey.trim(),
        })
      );
    } else {
      formData.set(
        "payload",
        JSON.stringify({
          protocol: "saml",
          id: provider.id,
          cert: rotateSamlCertValue.trim(),
        })
      );
    }

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
      <section
        aria-labelledby="erp-sso-providers-heading"
        className="erp-system-admin-sso-form"
      >
        <h2 id="erp-sso-providers-heading">Enterprise SSO</h2>
        <p>
          Configure tenant-scoped OIDC or SAML identity providers. Client
          secrets and private keys load from environment keys — never stored in
          settings or audit metadata.
        </p>
        <ul className="erp-system-admin-sso-form__provider-list">
          {ssoProviders.map((provider) => (
            <li key={provider.id}>
              <span>
                {provider.displayName} ({provider.providerId}) —{" "}
                {provider.domain} ·{" "}
                <span className="erp-system-admin-sso-form__protocol">
                  {provider.protocol.toUpperCase()}
                </span>
              </span>
              <Switch
                checked={provider.enabled}
                disabled={isSsoPending}
                onCheckedChange={(checked) => {
                  handleSsoToggle(provider, checked);
                }}
              />
              <details className="erp-system-admin-sso-form__rotate">
                <summary>Rotate credentials</summary>
                {provider.protocol === "oidc" ? (
                  <div className="erp-system-admin-form-section__fields">
                    <Label htmlFor={`sso-rotate-env-${provider.id}`}>
                      New client secret env key
                    </Label>
                    <Input
                      id={`sso-rotate-env-${provider.id}`}
                      onChange={(event) => {
                        setRotateOidcEnvKey(event.target.value);
                      }}
                      value={rotateOidcEnvKey}
                    />
                  </div>
                ) : (
                  <div className="erp-system-admin-form-section__fields">
                    <Label htmlFor={`sso-rotate-cert-${provider.id}`}>
                      New IdP certificate (PEM)
                    </Label>
                    <Textarea
                      id={`sso-rotate-cert-${provider.id}`}
                      onChange={(event) => {
                        setRotateSamlCertValue(event.target.value);
                      }}
                      value={rotateSamlCertValue}
                    />
                  </div>
                )}
                <Button
                  disabled={isSsoPending}
                  emphasis="solid"
                  intent="primary"
                  onClick={() => {
                    handleSsoRotate(provider);
                  }}
                  presentation="default"
                  size="md"
                  type="button"
                >
                  Apply rotation
                </Button>
              </details>
            </li>
          ))}
        </ul>
        <form
          className="erp-system-admin-settings-form erp-system-admin-sso-form__fields"
          onSubmit={handleSsoUpsert}
        >
          <fieldset className="erp-system-admin-form-section">
            <legend>Protocol</legend>
            <RadioGroup
              onValueChange={(value) => {
                setSsoProtocol(value as TenantSsoProtocol);
              }}
              value={ssoProtocol}
            >
              <div className="erp-system-admin-sso-form__protocol-option">
                <RadioGroupItem id="sso-protocol-oidc" value="oidc" />
                <Label htmlFor="sso-protocol-oidc">OIDC</Label>
              </div>
              <div className="erp-system-admin-sso-form__protocol-option">
                <RadioGroupItem id="sso-protocol-saml" value="saml" />
                <Label htmlFor="sso-protocol-saml">SAML 2.0</Label>
              </div>
            </RadioGroup>
          </fieldset>
          <div className="erp-system-admin-form-section__fields">
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
              <Label htmlFor="sso-issuer">
                {ssoProtocol === "saml"
                  ? "IdP entity ID / issuer URL"
                  : "Issuer URL"}
              </Label>
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
            {ssoProtocol === "oidc" ? (
              <>
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
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="sso-saml-entry-point">
                    SAML entry point URL
                  </Label>
                  <Input
                    id="sso-saml-entry-point"
                    name="samlEntryPoint"
                    onChange={(event) => {
                      setSamlEntryPoint(event.target.value);
                    }}
                    required
                    type="url"
                    value={samlEntryPoint}
                  />
                </div>
                <div className="erp-system-admin-sso-form__full-width">
                  <Label htmlFor="sso-saml-cert">
                    IdP signing certificate (PEM)
                  </Label>
                  <Textarea
                    id="sso-saml-cert"
                    name="samlCert"
                    onChange={(event) => {
                      setSamlCert(event.target.value);
                    }}
                    required
                    rows={4}
                    value={samlCert}
                  />
                </div>
                <div className="erp-system-admin-sso-form__full-width">
                  <Label htmlFor="sso-saml-idp-metadata">
                    IdP metadata XML (optional)
                  </Label>
                  <Textarea
                    id="sso-saml-idp-metadata"
                    name="samlIdpMetadataXml"
                    onChange={(event) => {
                      setSamlIdpMetadataXml(event.target.value);
                    }}
                    rows={4}
                    value={samlIdpMetadataXml}
                  />
                </div>
              </>
            )}
          </div>
          <div className="erp-system-admin-settings-form__actions">
            <Button disabled={isSsoPending} intent="primary" type="submit">
              Save SSO provider
            </Button>
          </div>
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
