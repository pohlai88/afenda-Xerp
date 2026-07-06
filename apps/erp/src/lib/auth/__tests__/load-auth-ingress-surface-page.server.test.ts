import { describe, expect, it } from "vitest";

import { AUTH_PATH_LANE_MAP, AUTH_PATHS } from "../auth-path.registry";
import { AFENDA_AUTH_SESSION_COOKIE_NAME } from "../auth-session-cookie.contract";
import { loadAuthIngressSurfacePage } from "../load-auth-ingress-surface-page.server";

describe("loadAuthIngressSurfacePage", () => {
  it("loads sign-in ingress with slot hydration", () => {
    const data = loadAuthIngressSurfacePage("/sign-in");

    expect(data.kind).toBe("ready");

    if (data.kind !== "ready") {
      return;
    }

    expect(data.surface.surfaceTemplate.surfaceTemplateId).toBe(
      "surface-template.auth-sign-in"
    );
    expect(data.path).toBe("/sign-in");
    expect(data.lane).toBe("access");
    expect(data.surface.slotHydration?.blockId).toBe("login-page-04");
  });

  it("loads sign-up ingress with register slot hydration", () => {
    const data = loadAuthIngressSurfacePage("/sign-up");

    expect(data.kind).toBe("ready");

    if (data.kind !== "ready") {
      return;
    }

    expect(data.surface.surfaceTemplate.surfaceTemplateId).toBe(
      "surface-template.auth-sign-up"
    );
    expect(data.path).toBe("/sign-up");
    expect(data.lane).toBe("access");
    expect(data.surface.slotHydration?.blockId).toBe("register-page-01");
  });

  it("loads reset-password ingress surfaces with dedicated slot hydration", () => {
    const expected = [
      {
        blockId: "forgot-password-page-01",
        path: "/forgot-password",
        surfaceTemplateId: "surface-template.auth-forgot-password",
      },
      {
        blockId: "forgot-password-success-page-01",
        path: "/forgot-password/success",
        surfaceTemplateId: "surface-template.auth-forgot-password-success",
      },
      {
        blockId: "reset-password-page-01",
        path: "/reset-password",
        surfaceTemplateId: "surface-template.auth-reset-password",
      },
      {
        blockId: "reset-password-success-page-01",
        path: "/reset-password/success",
        surfaceTemplateId: "surface-template.auth-reset-password-success",
      },
    ] as const;

    for (const ingress of expected) {
      const data = loadAuthIngressSurfacePage(ingress.path);

      expect(data.kind).toBe("ready");

      if (data.kind !== "ready") {
        continue;
      }

      expect(data.path).toBe(ingress.path);
      expect(data.lane).toBe(AUTH_PATH_LANE_MAP[ingress.path]);
      expect(data.surface.surfaceTemplate.surfaceTemplateId).toBe(
        ingress.surfaceTemplateId
      );
      expect(data.surface.slotHydration?.blockId).toBe(ingress.blockId);
    }
  });

  it("loads pre-login ingress surfaces with dedicated slot hydration", () => {
    const expected = [
      {
        blockId: "verify-email-page-01",
        path: "/verify-email",
        surfaceTemplateId: "surface-template.auth-verify-email",
      },
      {
        blockId: "verify-email-sent-page-01",
        path: "/verify-email/sent",
        surfaceTemplateId: "surface-template.auth-verify-email-sent",
      },
      {
        blockId: "verify-email-expired-page-01",
        path: "/verify-email/expired",
        surfaceTemplateId: "surface-template.auth-verify-email-expired",
      },
      {
        blockId: "verify-email-success-page-01",
        path: "/verify-email/success",
        surfaceTemplateId: "surface-template.auth-verify-email-success",
      },
      {
        blockId: "invite-page-01",
        path: "/invite",
        surfaceTemplateId: "surface-template.auth-invite",
      },
      {
        blockId: "invite-accept-page-01",
        path: "/invite/accept",
        surfaceTemplateId: "surface-template.auth-invite-accept",
      },
      {
        blockId: "invite-expired-page-01",
        path: "/invite/expired",
        surfaceTemplateId: "surface-template.auth-invite-expired",
      },
      {
        blockId: "invite-invalid-page-01",
        path: "/invite/invalid",
        surfaceTemplateId: "surface-template.auth-invite-invalid",
      },
      {
        blockId: "invite-consumed-page-01",
        path: "/invite/consumed",
        surfaceTemplateId: "surface-template.auth-invite-consumed",
      },
      {
        blockId: "invite-email-mismatch-page-01",
        path: "/invite/email-mismatch",
        surfaceTemplateId: "surface-template.auth-invite-email-mismatch",
      },
      {
        blockId: "passkey-page-01",
        path: "/passkey",
        surfaceTemplateId: "surface-template.auth-passkey",
      },
      {
        blockId: "error-passkey-page-01",
        path: "/passkey/error",
        surfaceTemplateId: "surface-template.error-auth-passkey",
      },
      {
        blockId: "sso-page-01",
        path: "/sso",
        surfaceTemplateId: "surface-template.auth-sso",
      },
      {
        blockId: "error-sso-page-01",
        path: "/sso/error",
        surfaceTemplateId: "surface-template.error-auth-sso",
      },
      {
        blockId: "error-oauth-page-01",
        path: "/oauth/error",
        surfaceTemplateId: "surface-template.error-auth-oauth",
      },
      {
        blockId: "otp-page-01",
        path: "/otp",
        surfaceTemplateId: "surface-template.auth-otp",
      },
      {
        blockId: "mfa-page-01",
        path: "/mfa",
        surfaceTemplateId: "surface-template.auth-mfa",
      },
      {
        blockId: "mfa-recovery-page-01",
        path: "/mfa/recovery",
        surfaceTemplateId: "surface-template.auth-mfa-recovery",
      },
      {
        blockId: "error-session-expired-page-01",
        path: "/session-expired",
        surfaceTemplateId: "surface-template.error-auth-session-expired",
      },
      {
        blockId: "error-access-denied-page-01",
        path: "/access-denied",
        surfaceTemplateId: "surface-template.error-auth-access-denied",
      },
      {
        blockId: "security-review-page-01",
        path: "/security/review",
        surfaceTemplateId: "surface-template.auth-security-review",
      },
      {
        blockId: "error-authentication-page-01",
        path: "/error",
        surfaceTemplateId: "surface-template.error-authentication",
      },
      {
        blockId: "login-page-03",
        path: "/workspace/select",
        surfaceTemplateId: "surface-template.auth-workspace-select",
      },
      {
        blockId: "login-page-03",
        path: "/organization/select",
        surfaceTemplateId: "surface-template.auth-workspace-select",
      },
    ] as const;

    for (const ingress of expected) {
      const data = loadAuthIngressSurfacePage(ingress.path);

      expect(data.kind).toBe("ready");

      if (data.kind !== "ready") {
        continue;
      }

      expect(data.authShellBlockId).toBe(ingress.blockId);
      expect(data.path).toBe(ingress.path);
      expect(data.lane).toBe(AUTH_PATH_LANE_MAP[ingress.path]);
      expect(data.surface.surfaceTemplate.surfaceTemplateId).toBe(
        ingress.surfaceTemplateId
      );
      expect(data.surface.slotHydration?.blockId).toBe(ingress.blockId);
    }
  });

  it("returns error for unknown ingress path at compile boundary", () => {
    expect(() => loadAuthIngressSurfacePage("/sign-in")).not.toThrow();
    expect(AUTH_PATHS.signIn).toBe("/sign-in");
    expect(AFENDA_AUTH_SESSION_COOKIE_NAME.length).toBeGreaterThan(0);
  });
});
