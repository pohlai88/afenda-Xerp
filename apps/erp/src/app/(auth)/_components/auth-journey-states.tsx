"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  AUTH_INVITE_COPY,
  AUTH_RECOVER_COPY,
  AUTH_SECURITY_COPY,
  AUTH_VERIFY_COPY,
  AUTH_WORKSPACE_STUB_COPY,
} from "@/lib/auth/auth-copy.registry";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { resolveSignInAfterPasswordResetPath } from "@/lib/auth/auth-redirect.policy";
import { AuthSecurityReviewPanel } from "@/lib/auth/auth-security-review-panel";
import {
  AUTH_ENTRY_ERROR_HINTS,
  AUTH_ENTRY_ERROR_MESSAGES,
  resolveAuthEntryError,
} from "@/lib/auth/resolve-auth-entry-error";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

export function AuthVerifyEmailSentState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticePositive
        hints={[AUTH_VERIFY_COPY.sentHint, AUTH_VERIFY_COPY.spamHint]}
        lead={AUTH_VERIFY_COPY.sentLead}
      />
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={buildAuthPath("signIn")}>
            Return to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function AuthVerifyEmailExpiredState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticeCaution
        hints={[AUTH_VERIFY_COPY.expiredHint]}
        lead={AUTH_VERIFY_COPY.expiredLead}
      />
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={buildAuthPath("signIn")}>
            Return to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function AuthVerifyEmailSuccessState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticePositive
        hints={[AUTH_VERIFY_COPY.successHint]}
        lead={AUTH_VERIFY_COPY.successLead}
      />
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={buildAuthPath("signIn")}>
            Continue to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function AuthResetPasswordSuccessState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticePositive
        hints={[AUTH_RECOVER_COPY.resetSuccessHint]}
        lead={AUTH_RECOVER_COPY.resetSuccessLead}
      />
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
    </AuthForm.Root>
  );
}

export function AuthSessionExpiredState() {
  const searchParams = useSearchParams();
  const nextPath = resolveSafeInternalPath(searchParams.get("next"), "");

  return (
    <AuthForm.Root>
      <AuthForm.NoticeCaution
        hints={[AUTH_SECURITY_COPY.sessionExpiredHint]}
        lead={AUTH_SECURITY_COPY.sessionExpiredLead}
      />
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
    </AuthForm.Root>
  );
}

export function AuthAccessDeniedState() {
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
    <AuthForm.Root>
      <AuthForm.NoticeCaution hints={[hint]} lead={lead} />
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={buildAuthPath("signIn")}>
            Return to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function AuthSecurityReviewState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticeNeutral
        hints={[AUTH_SECURITY_COPY.securityReviewHint]}
        lead={AUTH_SECURITY_COPY.securityReviewLead}
      />
      <AuthSecurityReviewPanel
        formClassName="erp-auth-form__security-review"
        linkClassName="erp-auth-form__link"
        listClassName="erp-auth-form__security-review-steps"
        signInPath={buildAuthPath("signIn")}
      />
    </AuthForm.Root>
  );
}

export function AuthInviteLandingState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticePositive
        hints={[AUTH_INVITE_COPY.inviteLandingHint]}
        lead={AUTH_INVITE_COPY.inviteLandingLead}
      />
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
    </AuthForm.Root>
  );
}

export function AuthInviteExpiredState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticeCaution
        hints={[AUTH_INVITE_COPY.inviteExpiredHint]}
        lead={AUTH_INVITE_COPY.inviteExpiredLead}
      />
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href={buildAuthPath("signIn")}>
            Return to sign in
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function AuthOrganizationSelectStubState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticeNeutral
        hints={[AUTH_WORKSPACE_STUB_COPY.organizationSelectHint]}
        lead={AUTH_WORKSPACE_STUB_COPY.organizationSelectLead}
      />
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href="/">
            Continue to workspace
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}

export function AuthWorkspaceSelectStubState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticeNeutral
        hints={[AUTH_WORKSPACE_STUB_COPY.workspaceSelectHint]}
        lead={AUTH_WORKSPACE_STUB_COPY.workspaceSelectLead}
      />
      <AuthForm.Alternates>
        <AuthForm.AlternateNotice>
          <Link className="erp-auth-form__link" href="/">
            Continue to workspace
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}
