/** Serializable dev-login panel contract — safe across RSC → client boundaries.
 *  Literal values are compile-time checked against `@afenda/auth` in
 *  `dev-login-panel.contract.alignment.ts` (server-only import). */
export const DEV_LOGIN_PANEL_TENANT_SLUG = "dev-local" as const;
export const DEV_LOGIN_PANEL_PASSWORD_ENV_KEY =
  "AFENDA_DEV_LOGIN_PASSWORD" as const;

export type DevLoginPanelAccountId = "admin" | "viewer";

export type DevLoginPanelAccount = {
  readonly email: string;
  readonly id: DevLoginPanelAccountId;
  readonly label: string;
  readonly password: string;
};

export type DevLoginPanelState =
  | { readonly enabled: false }
  | {
      readonly enabled: true;
      readonly status: "ready";
      readonly tenantSlug: typeof DEV_LOGIN_PANEL_TENANT_SLUG;
      readonly accounts: readonly DevLoginPanelAccount[];
    }
  | {
      readonly enabled: true;
      readonly status: "setup";
      readonly tenantSlug: typeof DEV_LOGIN_PANEL_TENANT_SLUG;
      readonly passwordEnvKey: typeof DEV_LOGIN_PANEL_PASSWORD_ENV_KEY;
    };

/** Canonical disabled state for sign-in surfaces and tests. */
export const DEV_LOGIN_PANEL_DISABLED = {
  enabled: false,
} satisfies DevLoginPanelState;
