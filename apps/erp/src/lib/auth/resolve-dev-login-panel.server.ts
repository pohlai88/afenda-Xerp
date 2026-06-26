import {
  DEV_BOOTSTRAP_TENANT_SLUG,
  DEV_LOGIN_DISPLAY_NAME,
  DEV_LOGIN_PASSWORD_ENV,
  DEV_VIEWER_LOGIN_DISPLAY_NAME,
  DEV_VIEWER_LOGIN_EMAIL,
  hasDevLoginCredentials,
  hasDevViewerLoginCredentials,
  isDevLoginPanelEnabled,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
  resolveDevViewerLoginPassword,
} from "@afenda/auth";

import type {
  DevLoginPanelAccount,
  DevLoginPanelState,
} from "@/lib/auth/dev-login-panel.contract";
import type { EnvReaderInput } from "@/lib/env/env-reader-source";
import { readRuntimeEnvSource } from "@/lib/env/env-reader-source";

import "@/lib/auth/dev-login-panel.contract.alignment";

function resolveDevLoginPanelAccounts(
  env: EnvReaderInput<string>
): readonly DevLoginPanelAccount[] {
  const accounts: DevLoginPanelAccount[] = [
    {
      email: resolveDevLoginEmail(env),
      id: "admin",
      label: DEV_LOGIN_DISPLAY_NAME,
      password: resolveDevLoginPassword(env),
    },
  ];

  if (hasDevViewerLoginCredentials(env)) {
    accounts.push({
      email: DEV_VIEWER_LOGIN_EMAIL,
      id: "viewer",
      label: DEV_VIEWER_LOGIN_DISPLAY_NAME,
      password: resolveDevViewerLoginPassword(env),
    });
  }

  return accounts;
}

export function resolveDevLoginPanelState(
  env: EnvReaderInput<string> = readRuntimeEnvSource()
): DevLoginPanelState {
  if (!isDevLoginPanelEnabled(env)) {
    return { enabled: false };
  }

  if (!hasDevLoginCredentials(env)) {
    return {
      enabled: true,
      passwordEnvKey: DEV_LOGIN_PASSWORD_ENV,
      status: "setup",
      tenantSlug: DEV_BOOTSTRAP_TENANT_SLUG,
    } satisfies Extract<DevLoginPanelState, { status: "setup" }>;
  }

  return {
    accounts: resolveDevLoginPanelAccounts(env),
    enabled: true,
    status: "ready",
    tenantSlug: DEV_BOOTSTRAP_TENANT_SLUG,
  } satisfies Extract<DevLoginPanelState, { status: "ready" }>;
}
