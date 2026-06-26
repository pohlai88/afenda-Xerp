import {
  DEV_BOOTSTRAP_TENANT_SLUG,
  DEV_LOGIN_DISPLAY_NAME,
  DEV_LOGIN_EMAIL,
  DEV_LOGIN_PANEL_ENV,
  DEV_LOGIN_PASSWORD_ENV,
  DEV_VIEWER_LOGIN_DISPLAY_NAME,
  DEV_VIEWER_LOGIN_EMAIL,
} from "@afenda/auth";
import { describe, expect, it } from "vitest";

import { resolveDevLoginPanelState } from "@/lib/auth/resolve-dev-login-panel.server";
import type { EnvReaderInput } from "@/lib/env/env-reader-source";

const devEnv = {
  NODE_ENV: "development",
  [DEV_LOGIN_PASSWORD_ENV]: "DevLocalLogin!23",
} satisfies EnvReaderInput<string>;

describe("resolveDevLoginPanelState", () => {
  it("returns disabled in production-like runtimes", () => {
    expect(
      resolveDevLoginPanelState({
        NODE_ENV: "production",
        [DEV_LOGIN_PASSWORD_ENV]: "DevLocalLogin!23",
      })
    ).toEqual({ enabled: false });
  });

  it("returns disabled when the panel kill switch is set", () => {
    expect(
      resolveDevLoginPanelState({
        ...devEnv,
        [DEV_LOGIN_PANEL_ENV]: "0",
      })
    ).toEqual({ enabled: false });
  });

  it("returns setup guidance when credentials are missing in dev", () => {
    expect(
      resolveDevLoginPanelState({
        NODE_ENV: "development",
      })
    ).toEqual({
      enabled: true,
      passwordEnvKey: DEV_LOGIN_PASSWORD_ENV,
      status: "setup",
      tenantSlug: DEV_BOOTSTRAP_TENANT_SLUG,
    });
  });

  it("returns admin and viewer accounts when credentials are configured", () => {
    expect(resolveDevLoginPanelState(devEnv)).toEqual({
      enabled: true,
      status: "ready",
      tenantSlug: DEV_BOOTSTRAP_TENANT_SLUG,
      accounts: [
        {
          email: DEV_LOGIN_EMAIL,
          id: "admin",
          label: DEV_LOGIN_DISPLAY_NAME,
          password: "DevLocalLogin!23",
        },
        {
          email: DEV_VIEWER_LOGIN_EMAIL,
          id: "viewer",
          label: DEV_VIEWER_LOGIN_DISPLAY_NAME,
          password: "DevLocalLogin!23-viewer",
        },
      ],
    });
  });
});
