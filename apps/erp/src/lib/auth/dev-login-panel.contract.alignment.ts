/**
 * Compile-time guard: ERP dev-login panel literals must stay aligned with
 * `@afenda/auth` bootstrap fixtures. Imported only from server resolver.
 */
import type {
  DEV_BOOTSTRAP_TENANT_SLUG,
  DEV_LOGIN_PASSWORD_ENV,
} from "@afenda/auth";

import {
  DEV_LOGIN_PANEL_PASSWORD_ENV_KEY,
  DEV_LOGIN_PANEL_TENANT_SLUG,
} from "@/lib/auth/dev-login-panel.contract";

const _tenantSlugMatchesAuth: typeof DEV_BOOTSTRAP_TENANT_SLUG =
  DEV_LOGIN_PANEL_TENANT_SLUG;

const _passwordEnvKeyMatchesAuth: typeof DEV_LOGIN_PASSWORD_ENV =
  DEV_LOGIN_PANEL_PASSWORD_ENV_KEY;
