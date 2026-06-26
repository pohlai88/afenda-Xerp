import type { SignInProviderSurface } from "@afenda/auth";
import { buildDefaultTenantOAuthSettings } from "@afenda/database";
import { describe, expect, it } from "vitest";

import { mergeTenantSignInSurface } from "../merge-tenant-sign-in-surface";

const platformSurface: SignInProviderSurface = {
  passkeyEnabled: true,
  socialProviderIds: ["google", "github"],
  ssoEnabled: true,
};

describe("mergeTenantSignInSurface", () => {
  it("filters social providers to tenant-enabled allowlist", () => {
    const tenantOAuth = buildDefaultTenantOAuthSettings();
    tenantOAuth.providers.google.enabled = true;

    expect(mergeTenantSignInSurface(platformSurface, tenantOAuth, 0)).toEqual({
      passkeyEnabled: true,
      socialProviderIds: ["google"],
      ssoEnabled: false,
    });
  });

  it("requires at least one enabled SSO provider before showing SSO", () => {
    const tenantOAuth = buildDefaultTenantOAuthSettings();
    tenantOAuth.providers.google.enabled = true;
    tenantOAuth.providers.github.enabled = true;

    expect(mergeTenantSignInSurface(platformSurface, tenantOAuth, 2)).toEqual({
      passkeyEnabled: true,
      socialProviderIds: ["google", "github"],
      ssoEnabled: true,
    });
  });

  it("returns platform providers when oauth settings are absent", () => {
    expect(mergeTenantSignInSurface(platformSurface, undefined, 0)).toEqual({
      passkeyEnabled: true,
      socialProviderIds: ["google", "github"],
      ssoEnabled: false,
    });
  });

  it("returns empty tenant methods when oauth settings are explicitly null", () => {
    expect(mergeTenantSignInSurface(platformSurface, null, 0)).toEqual({
      passkeyEnabled: true,
      socialProviderIds: [],
      ssoEnabled: false,
    });
  });
});
