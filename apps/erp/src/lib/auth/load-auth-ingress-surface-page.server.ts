import { createMetadataRuntimeContext } from "@/lib/metadata/metadata-runtime.contract";
import type { MetadataOperatorSurfaceWire } from "@/lib/metadata/resolve-metadata-operator-surface.server";
import { resolveMetadataOperatorSurface } from "@/lib/metadata/resolve-metadata-operator-surface.server";

import {
  type AuthIngressCanonicalPath,
  getAuthIngressSurfaceByPath,
} from "./auth-ingress-surface.registry";
import {
  AUTH_PATH_LANE_MAP,
  AUTH_PATHS,
  type AuthLane,
  resolveAuthShellBlockIdForPath,
} from "./auth-path.registry";

export type AuthIngressSurfacePageData =
  | {
      readonly kind: "error";
      readonly message: string;
      readonly title: string;
    }
  | {
      readonly authShellBlockId: string;
      readonly description: string;
      readonly kind: "ready";
      readonly lane: AuthLane;
      readonly path: AuthIngressCanonicalPath;
      readonly surface: MetadataOperatorSurfaceWire;
      readonly title: string;
    };

/** Public auth ingress — anonymous metadata runtime (no protected operating context). */
export function loadAuthIngressSurfacePage(
  path: AuthIngressCanonicalPath
): AuthIngressSurfacePageData {
  const ingress = getAuthIngressSurfaceByPath(path);

  if (ingress === undefined) {
    return {
      kind: "error",
      title: "Auth ingress unavailable",
      message: `No auth ingress surface registered for path: ${path}`,
    };
  }

  const runtime = createMetadataRuntimeContext();
  const surface = resolveMetadataOperatorSurface({
    runtime,
    surfaceTemplateId: ingress.surfaceTemplateId,
  });

  if (surface === undefined) {
    return {
      kind: "error",
      title: resolveAuthIngressTitle(path),
      message: "The auth ingress surface template is not registered.",
    };
  }

  return {
    authShellBlockId: resolveAuthShellBlockIdForPath(path),
    kind: "ready",
    lane: AUTH_PATH_LANE_MAP[path],
    path,
    title: resolveAuthIngressTitle(path),
    description: resolveAuthIngressDescription(path),
    surface,
  };
}

export function resolveAuthIngressTitle(
  path: AuthIngressCanonicalPath
): string {
  switch (path) {
    case AUTH_PATHS.signUp:
      return "Accept invitation";
    case AUTH_PATHS.otp:
      return "One-time passcode";
    case AUTH_PATHS.mfa:
      return "Multi-factor verification";
    case AUTH_PATHS.mfaRecovery:
      return "Recovery code";
    case AUTH_PATHS.verifyEmail.root:
      return "Verify email";
    case AUTH_PATHS.verifyEmail.sent:
      return "Check your email";
    case AUTH_PATHS.verifyEmail.expired:
      return "Verification expired";
    case AUTH_PATHS.verifyEmail.success:
      return "Email verified";
    case AUTH_PATHS.forgotPassword.root:
      return "Reset password";
    case AUTH_PATHS.forgotPassword.success:
      return "Check your email";
    case AUTH_PATHS.resetPassword.root:
      return "Create new password";
    case AUTH_PATHS.resetPassword.success:
      return "Password updated";
    case AUTH_PATHS.invite.root:
      return "Workspace invitation";
    case AUTH_PATHS.invite.accept:
      return "Accept invitation";
    case AUTH_PATHS.invite.expired:
      return "Invitation expired";
    case AUTH_PATHS.invite.invalid:
      return "Invitation invalid";
    case AUTH_PATHS.invite.consumed:
      return "Invitation already used";
    case AUTH_PATHS.invite.emailMismatch:
      return "Invitation email mismatch";
    case AUTH_PATHS.passkey.root:
      return "Use a passkey";
    case AUTH_PATHS.passkey.error:
      return "Passkey unavailable";
    case AUTH_PATHS.sso.root:
      return "Continue with SSO";
    case AUTH_PATHS.sso.error:
      return "SSO unavailable";
    case AUTH_PATHS.oauth.error:
      return "Social sign-in failed";
    case AUTH_PATHS.sessionExpired:
      return "Session expired";
    case AUTH_PATHS.accessDenied:
      return "Access denied";
    case AUTH_PATHS.securityReview:
      return "Security review required";
    case AUTH_PATHS.error:
      return "Authentication error";
    default:
      return "Sign in";
  }
}

export function resolveAuthIngressDescription(
  path: AuthIngressCanonicalPath
): string {
  switch (path) {
    case AUTH_PATHS.signUp:
      return "Create credentials for your approved Afenda ERP workspace.";
    case AUTH_PATHS.otp:
      return "Enter the one-time passcode required to continue authentication.";
    case AUTH_PATHS.mfa:
      return "Complete multi-factor verification before workspace access.";
    case AUTH_PATHS.mfaRecovery:
      return "Use a recovery code to complete multi-factor verification.";
    case AUTH_PATHS.verifyEmail.root:
      return "Verify your email address before signing in.";
    case AUTH_PATHS.verifyEmail.sent:
      return "Verification instructions were sent if the account exists.";
    case AUTH_PATHS.verifyEmail.expired:
      return "Request a fresh verification link before signing in.";
    case AUTH_PATHS.verifyEmail.success:
      return "Return to sign in with your verified email address.";
    case AUTH_PATHS.forgotPassword.root:
      return "Request reset instructions for your Afenda ERP account.";
    case AUTH_PATHS.forgotPassword.success:
      return "Reset instructions were sent if the account exists.";
    case AUTH_PATHS.resetPassword.root:
      return "Create a new password for your Afenda ERP account.";
    case AUTH_PATHS.resetPassword.success:
      return "Return to sign in with your updated password.";
    case AUTH_PATHS.invite.root:
      return "Review the workspace invitation entry point.";
    case AUTH_PATHS.invite.accept:
      return "Create credentials with the approved workspace invitation.";
    case AUTH_PATHS.invite.expired:
      return "Request a new invitation from your workspace administrator.";
    case AUTH_PATHS.invite.invalid:
      return "Request a valid workspace invitation before creating credentials.";
    case AUTH_PATHS.invite.consumed:
      return "Sign in with the account that already accepted this invitation.";
    case AUTH_PATHS.invite.emailMismatch:
      return "Use the invited email address or request a corrected invitation.";
    case AUTH_PATHS.passkey.root:
      return "Continue with a registered passkey for this operator account.";
    case AUTH_PATHS.passkey.error:
      return "Restart sign-in after the passkey request could not complete.";
    case AUTH_PATHS.sso.root:
      return "Continue with your organization identity provider.";
    case AUTH_PATHS.sso.error:
      return "Restart sign-in after the organization identity request failed.";
    case AUTH_PATHS.oauth.error:
      return "Restart sign-in after the external provider callback failed.";
    case AUTH_PATHS.sessionExpired:
      return "Sign in again after the previous session expired.";
    case AUTH_PATHS.accessDenied:
      return "Use an approved account before accessing this workspace.";
    case AUTH_PATHS.securityReview:
      return "Complete the required security review before workspace access.";
    case AUTH_PATHS.error:
      return "Restart sign-in after an authentication request error.";
    default:
      return "Access your Afenda ERP operator workspace.";
  }
}
