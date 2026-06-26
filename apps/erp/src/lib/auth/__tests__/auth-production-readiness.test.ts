import { describe, expect, it } from "vitest";

import {
  isPasswordlessPostAuthSignInMethod,
  isSecurityReviewOnPasswordlessActive,
} from "../auth-post-auth-method.constants";
import { resolveTenantMfaEnrollmentRedirect } from "../gate-tenant-mfa-policy.server";
import { mergeTenantSignInSurface } from "../merge-tenant-sign-in-surface";

describe("auth production readiness contracts", () => {
  it("staging checklist step 3 — tenant OAuth toggles hide disabled providers", () => {
    const merged = mergeTenantSignInSurface(
      {
        passkeyEnabled: true,
        socialProviderIds: ["google", "github"],
        ssoEnabled: true,
      },
      {
        providers: {
          google: {
            clientId: "",
            displayName: "Google",
            enabled: true,
          },
          github: {
            clientId: "",
            displayName: "GitHub",
            enabled: false,
          },
        },
      },
      0
    );

    expect(merged.socialProviderIds).toEqual(["google"]);
    expect(merged.ssoEnabled).toBe(false);
  });

  it("staging checklist step 4 — tenant MFA gate redirects to enrollment", () => {
    expect(resolveTenantMfaEnrollmentRedirect("/dashboard")).toBe(
      "/settings/security?notice=mfa-required&next=%2Fdashboard"
    );
  });

  it("staging checklist step 1 — passwordless methods are detectable for review gate", () => {
    expect(isPasswordlessPostAuthSignInMethod("google")).toBe(true);
    expect(isPasswordlessPostAuthSignInMethod("email")).toBe(false);
  });

  it("documents env toggles for staging validation", () => {
    expect(
      isSecurityReviewOnPasswordlessActive({
        AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS: "true",
      })
    ).toBe(true);
  });
});
