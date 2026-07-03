/**
 * PAS-006 — canonical public auth ingress surfaces (metadata-driven UI).
 * SSOT for public auth paths ↔ surface templates ↔ presentation blocks.
 */

import type { AuthShellVariant } from "./auth-path.registry.js";

export type AuthIngressSurfaceEntry = {
  readonly blockId: AuthShellVariant;
  readonly path: string;
  readonly surfaceTemplateId: string;
};

/** Protected operator metadata preview — not a second sign-in ingress. */
export const AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT = {
  destination: "/metadata-workspace",
  source: "/operator/auth/sign-in",
} as const;

export const AUTH_INGRESS_CANONICAL_SURFACES = [
  {
    blockId: "login-page-04",
    path: "/sign-in",
    surfaceTemplateId: "surface-template.auth-sign-in",
  },
  {
    blockId: "register-page-01",
    path: "/sign-up",
    surfaceTemplateId: "surface-template.auth-sign-up",
  },
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
] as const satisfies readonly AuthIngressSurfaceEntry[];

export type AuthIngressCanonicalPath =
  (typeof AUTH_INGRESS_CANONICAL_SURFACES)[number]["path"];

export const AUTH_INGRESS_PUBLIC_PATH_PREFIXES =
  AUTH_INGRESS_CANONICAL_SURFACES.map(
    (surface) => surface.path
  ) as AuthIngressCanonicalPath[];

export function isAuthIngressCanonicalPath(
  pathname: string
): pathname is AuthIngressCanonicalPath {
  return AUTH_INGRESS_PUBLIC_PATH_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function getAuthIngressSurfaceByPath(
  pathname: string
): AuthIngressSurfaceEntry | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return AUTH_INGRESS_CANONICAL_SURFACES.find(
    (surface) => surface.path === normalized
  );
}
