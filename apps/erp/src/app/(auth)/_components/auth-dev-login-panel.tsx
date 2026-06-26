"use client";

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useEffect, useState } from "react";

import type {
  DevLoginPanelAccount,
  DevLoginPanelState,
} from "@/lib/auth/dev-login-panel.contract";

export type AuthDevLoginPanelGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Collapsible" | "CollapsibleContent" | "CollapsibleTrigger"
>;

const DEV_LOGIN_PANEL_STORAGE_KEY = "afenda-dev-login-panel-open";

type DevLoginPanelProps = {
  readonly onFillCredentials: (account: DevLoginPanelAccount) => void;
  readonly onQuickSignIn: (account: DevLoginPanelAccount) => void;
  readonly panel: Extract<DevLoginPanelState, { enabled: true }>;
};

function readStoredOpenPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DEV_LOGIN_PANEL_STORAGE_KEY) === "open";
}

async function copyCredentialValue(value: string): Promise<void> {
  if (!navigator.clipboard?.writeText) {
    return;
  }

  await navigator.clipboard.writeText(value);
}

function DevLoginSetupState({
  panel,
}: {
  readonly panel: Extract<DevLoginPanelState, { status: "setup" }>;
}) {
  return (
    <div className="erp-auth-dev-login-panel__setup">
      <p className="erp-auth-dev-login-panel__lead">
        Local developer sign-in is not configured yet.
      </p>
      <ol className="erp-auth-dev-login-panel__steps">
        <li>
          Set <code>{panel.passwordEnvKey}</code> in <code>.env.secret</code>{" "}
          (minimum 8 characters), then run <code>pnpm env:sync</code>.
        </li>
        <li>
          Run <code>pnpm db:bootstrap:local</code>
        </li>
        <li>
          Run <code>pnpm auth:bootstrap:dev</code>
        </li>
      </ol>
      <p className="erp-auth-dev-login-panel__hint">
        Tenant slug: <span>{panel.tenantSlug}</span>
      </p>
    </div>
  );
}

function DevLoginAccountRow({
  account,
  onFillCredentials,
  onQuickSignIn,
}: {
  readonly account: DevLoginPanelAccount;
  readonly onFillCredentials: (account: DevLoginPanelAccount) => void;
  readonly onQuickSignIn: (account: DevLoginPanelAccount) => void;
}) {
  return (
    <article
      aria-label={`${account.label} developer account`}
      className="erp-auth-dev-login-panel__account"
    >
      <div className="erp-auth-dev-login-panel__account-header">
        <h3 className="erp-auth-dev-login-panel__account-title">
          {account.label}
        </h3>
        <span className="erp-auth-dev-login-panel__account-id">
          {account.id}
        </span>
      </div>

      <dl className="erp-auth-dev-login-panel__credentials">
        <div className="erp-auth-dev-login-panel__credential">
          <dt>Email</dt>
          <dd>
            <code>{account.email}</code>
            <button
              className="erp-auth-dev-login-panel__copy"
              onClick={() => {
                void copyCredentialValue(account.email);
              }}
              type="button"
            >
              Copy email
            </button>
          </dd>
        </div>
        <div className="erp-auth-dev-login-panel__credential">
          <dt>Password</dt>
          <dd>
            <code>{account.password}</code>
            <button
              className="erp-auth-dev-login-panel__copy"
              onClick={() => {
                void copyCredentialValue(account.password);
              }}
              type="button"
            >
              Copy password
            </button>
          </dd>
        </div>
      </dl>

      <div className="erp-auth-dev-login-panel__actions">
        <Button
          emphasis="outline"
          intent="secondary"
          onClick={() => {
            onFillCredentials(account);
          }}
          presentation="default"
          size="sm"
          type="button"
        >
          Fill form
        </Button>
        <Button
          emphasis="solid"
          intent="primary"
          onClick={() => {
            onQuickSignIn(account);
          }}
          presentation="default"
          size="sm"
          type="button"
        >
          Sign in
        </Button>
      </div>
    </article>
  );
}

export function AuthDevLoginPanel({
  onFillCredentials,
  onQuickSignIn,
  panel,
}: DevLoginPanelProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readStoredOpenPreference());
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    window.localStorage.setItem(
      DEV_LOGIN_PANEL_STORAGE_KEY,
      nextOpen ? "open" : "closed"
    );
  }

  return (
    <section
      aria-label="Developer sign-in"
      className="erp-auth-dev-login-panel"
    >
      <Collapsible onOpenChange={handleOpenChange} open={open}>
        <CollapsibleTrigger asChild>
          <button
            aria-expanded={open}
            className="erp-auth-dev-login-panel__toggle"
            type="button"
          >
            <span className="erp-auth-dev-login-panel__badge">Dev</span>
            <span>Developer sign-in</span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="erp-auth-dev-login-panel__content">
            {panel.status === "setup" ? (
              <DevLoginSetupState panel={panel} />
            ) : (
              <>
                <div className="erp-auth-dev-login-panel__accounts">
                  {panel.accounts.map((account) => (
                    <DevLoginAccountRow
                      account={account}
                      key={account.id}
                      onFillCredentials={onFillCredentials}
                      onQuickSignIn={onQuickSignIn}
                    />
                  ))}
                </div>
                <p className="erp-auth-dev-login-panel__hint">
                  Tenant <span>{panel.tenantSlug}</span>. Run{" "}
                  <code>pnpm auth:bootstrap:dev</code> after changing local
                  passwords. MFA policy may redirect to <code>/mfa</code>.
                </p>
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
