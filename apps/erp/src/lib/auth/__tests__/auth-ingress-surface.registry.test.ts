import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { ERP_SRC_ROOT } from "@/__tests__/support/erp-test-paths";
import {
  AUTH_INGRESS_CANONICAL_SURFACES,
  AUTH_INGRESS_PUBLIC_PATH_PREFIXES,
  AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT,
  getAuthIngressSurfaceByPath,
  isAuthIngressCanonicalPath,
} from "../auth-ingress-surface.registry";
import { AUTH_PATHS } from "../auth-path.registry";
import { PUBLIC_APP_ROUTER_PATH_PREFIXES } from "../auth-protected-surface.registry";

const POST_AUTH_WORKSPACE_SELECTION_PATHS = new Set<string>([
  AUTH_PATHS.workspaceSelect,
  AUTH_PATHS.organizationSelect,
]);

describe("auth-ingress-surface.registry", () => {
  it("registers serializable canonical auth ingress surfaces", () => {
    for (const surface of AUTH_INGRESS_CANONICAL_SURFACES) {
      expect(JSON.parse(JSON.stringify(surface))).toEqual(surface);
      expect(surface.blockId.length).toBeGreaterThan(0);
    }
  });

  it("maps sign-in path to auth sign-in surface template", () => {
    expect(getAuthIngressSurfaceByPath("/sign-in")?.surfaceTemplateId).toBe(
      "surface-template.auth-sign-in"
    );
  });

  it("maps sign-up path to register surface template", () => {
    expect(getAuthIngressSurfaceByPath("/sign-up")).toMatchObject({
      blockId: "register-page-01",
      surfaceTemplateId: "surface-template.auth-sign-up",
    });
  });

  it("maps recover paths to reset-password surface templates", () => {
    expect(getAuthIngressSurfaceByPath("/forgot-password")).toMatchObject({
      blockId: "forgot-password-page-01",
      surfaceTemplateId: "surface-template.auth-forgot-password",
    });
    expect(
      getAuthIngressSurfaceByPath("/forgot-password/success")
    ).toMatchObject({
      blockId: "forgot-password-success-page-01",
      surfaceTemplateId: "surface-template.auth-forgot-password-success",
    });
    expect(getAuthIngressSurfaceByPath("/reset-password")).toMatchObject({
      blockId: "reset-password-page-01",
      surfaceTemplateId: "surface-template.auth-reset-password",
    });
    expect(
      getAuthIngressSurfaceByPath("/reset-password/success")
    ).toMatchObject({
      blockId: "reset-password-success-page-01",
      surfaceTemplateId: "surface-template.auth-reset-password-success",
    });
  });

  it("maps pre-login paths to dedicated auth-shell surface templates", () => {
    const expectedSurfaces = [
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
    ] as const;

    for (const expectedSurface of expectedSurfaces) {
      expect(getAuthIngressSurfaceByPath(expectedSurface.path)).toMatchObject(
        expectedSurface
      );
    }
  });

  it("maps post-auth workspace selection paths to login-page-03 ingress templates", () => {
    expect(
      getAuthIngressSurfaceByPath(AUTH_PATHS.workspaceSelect)
    ).toMatchObject({
      blockId: "login-page-03",
      surfaceTemplateId: "surface-template.auth-workspace-select",
    });
    expect(
      getAuthIngressSurfaceByPath(AUTH_PATHS.organizationSelect)
    ).toMatchObject({
      blockId: "login-page-03",
      surfaceTemplateId: "surface-template.auth-workspace-select",
    });
  });

  it("does not map pre-login ingress paths to login fallbacks", () => {
    for (const surface of AUTH_INGRESS_CANONICAL_SURFACES) {
      if (surface.path === "/sign-in") {
        continue;
      }

      if (POST_AUTH_WORKSPACE_SELECTION_PATHS.has(surface.path)) {
        continue;
      }

      expect(surface.blockId).not.toMatch(/^login-page-/);
    }
  });

  it("keeps auth ingress paths public in auth-protected-surface registry", () => {
    for (const path of AUTH_INGRESS_PUBLIC_PATH_PREFIXES) {
      expect(
        PUBLIC_APP_ROUTER_PATH_PREFIXES.some(
          (prefix) => path === prefix || path.startsWith(`${prefix}/`)
        )
      ).toBe(true);
    }
  });

  it("maps each canonical ingress surface to an app route page file", () => {
    const appRoot = join(ERP_SRC_ROOT, "app", "(auth)");

    for (const surface of AUTH_INGRESS_CANONICAL_SURFACES) {
      expect(isAuthIngressCanonicalPath(surface.path)).toBe(true);
      const pagePath = join(
        appRoot,
        surface.path.replace(/^\//, ""),
        "page.tsx"
      );
      expect(existsSync(pagePath)).toBe(true);
    }
  });

  it("redirects legacy operator preview path to metadata workspace", () => {
    expect(AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT.source).toBe(
      "/operator/auth/sign-in"
    );
    expect(AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT.destination).toBe(
      "/metadata-workspace"
    );
  });
});
