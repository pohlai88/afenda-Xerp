"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import { AuthStatePage } from "@/app/(auth)/_components/auth-state-page";
import {
  AUTH_INVITE_COPY,
  AUTH_RECOVER_COPY,
  AUTH_SECURITY_COPY,
  AUTH_VERIFY_COPY,
  AUTH_WORKSPACE_STUB_COPY,
} from "@/lib/auth/auth-copy.registry";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { resolveSignInAfterPasswordResetPath } from "@/lib/auth/auth-redirect.policy";
import {
  AUTH_ENTRY_ERROR_HINTS,
  AUTH_ENTRY_ERROR_MESSAGES,
  resolveAuthEntryError,
} from "@/lib/auth/resolve-auth-entry-error";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

export function VerifyEmailSentState() {
  return (
    <AuthStatePage
      hints={[AUTH_VERIFY_COPY.sentHint, AUTH_VERIFY_COPY.spamHint]}
      lead={AUTH_VERIFY_COPY.sentLead}
      route="verifyEmailSent"
      tone="positive"
    />
  );
}

export function VerifyEmailExpiredState() {
  return (
    <AuthStatePage
      hints={[AUTH_VERIFY_COPY.expiredHint]}
      lead={AUTH_VERIFY_COPY.expiredLead}
      route="verifyEmailExpired"
      tone="negative"
    />
  );
}

export function VerifyEmailSuccessState() {
  return (
    <AuthStatePage
      hints={[AUTH_VERIFY_COPY.successHint]}
      lead={AUTH_VERIFY_COPY.successLead}
      route="verifyEmailSuccess"
      tone="positive"
    >
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={buildAuthPath("signIn")}>
            Continue to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthStatePage>
  );
}

export function ResetPasswordSuccessState() {
  return (
    <AuthStatePage
      hints={[AUTH_RECOVER_COPY.resetSuccessHint]}
      lead={AUTH_RECOVER_COPY.resetSuccessLead}
      route="resetPasswordSuccess"
      tone="positive"
    >
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link
            className="erp-auth-form__link"
            href={resolveSignInAfterPasswordResetPath()}
          >
            Continue to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthStatePage>
  );
}

export function SessionExpiredState() {
  const searchParams = useSearchParams();
  const nextPath = resolveSafeInternalPath(searchParams.get("next"), "");

  return (
    <AuthStatePage
      hints={[AUTH_SECURITY_COPY.sessionExpiredHint]}
      lead={AUTH_SECURITY_COPY.sessionExpiredLead}
      route="sessionExpired"
      tone="negative"
    >
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link
            className="erp-auth-form__link"
            href={buildAuthPath("signIn", {
              next: nextPath.length > 0 ? nextPath : undefined,
            })}
          >
            Sign in again
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthStatePage>
  );
}

export function AccessDeniedState() {
  const searchParams = useSearchParams();
  const reason = resolveAuthEntryError(searchParams.get("reason"));
  const lead =
    reason === "unlinked"
      ? AUTH_ENTRY_ERROR_MESSAGES.unlinked
      : AUTH_SECURITY_COPY.accessDeniedLead;
  const hint =
    reason === "unlinked"
      ? AUTH_ENTRY_ERROR_HINTS.unlinked
      : AUTH_SECURITY_COPY.accessDeniedHint;

  return (
    <AuthStatePage
      hints={[hint]}
      lead={lead}
      route="accessDenied"
      tone="negative"
    />
  );
}

export function WorkspaceSelectStubState() {
  return (
    <AuthStatePage
      hints={[AUTH_WORKSPACE_STUB_COPY.workspaceSelectHint]}
      lead={AUTH_WORKSPACE_STUB_COPY.workspaceSelectLead}
      route="workspaceSelect"
    >
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href="/">
            Continue to workspace
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthStatePage>
  );
}

export function OrganizationSelectStubState() {
  return (
    <AuthStatePage
      hints={[AUTH_WORKSPACE_STUB_COPY.organizationSelectHint]}
      lead={AUTH_WORKSPACE_STUB_COPY.organizationSelectLead}
      route="organizationSelect"
    >
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href="/">
            Continue to workspace
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthStatePage>
  );
}

export function SecurityReviewStubState() {
  return (
    <AuthStatePage
      hints={[AUTH_SECURITY_COPY.securityReviewHint]}
      lead={AUTH_SECURITY_COPY.securityReviewLead}
      route="securityReview"
    />
  );
}

export function InviteLandingState() {
  return (
    <AuthStatePage
      hints={[AUTH_INVITE_COPY.inviteLandingHint]}
      lead={AUTH_INVITE_COPY.inviteLandingLead}
      route="invite"
    >
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link
            className="erp-auth-form__link"
            href={buildAuthPath("invite.accept")}
          >
            Accept invitation
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthStatePage>
  );
}

export function InviteExpiredState() {
  return (
    <AuthStatePage
      hints={[AUTH_INVITE_COPY.inviteExpiredHint]}
      lead={AUTH_INVITE_COPY.inviteExpiredLead}
      route="inviteExpired"
      tone="negative"
    />
  );
}
