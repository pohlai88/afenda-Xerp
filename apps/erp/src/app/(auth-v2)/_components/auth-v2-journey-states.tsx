"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import {
  AUTH_RECOVER_COPY,
  AUTH_SECURITY_COPY,
  AUTH_VERIFY_COPY,
  AUTH_WORKSPACE_STUB_COPY,
} from "@/app/(auth-v2)/_components/auth-v2-form.copy";
import { AUTH_INVITE_COPY } from "@/lib/auth/auth-copy.registry";
import { AuthSecurityReviewPanel } from "@/lib/auth/auth-security-review-panel";
import {
  AUTH_ENTRY_ERROR_HINTS,
  AUTH_ENTRY_ERROR_MESSAGES,
  resolveAuthEntryError,
} from "@/lib/auth/resolve-auth-entry-error";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";
import { resolveAuthV2SignInAfterPasswordResetPath } from "@/lib/auth-v2/auth-v2-redirect.policy";

export function AuthV2VerifyEmailSentState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticePositive
        hints={[AUTH_VERIFY_COPY.sentHint, AUTH_VERIFY_COPY.spamHint]}
        lead={AUTH_VERIFY_COPY.sentLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("signIn")}
          >
            Return to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2VerifyEmailExpiredState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticeCaution
        hints={[AUTH_VERIFY_COPY.expiredHint]}
        lead={AUTH_VERIFY_COPY.expiredLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("signIn")}
          >
            Return to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2VerifyEmailSuccessState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticePositive
        hints={[AUTH_VERIFY_COPY.successHint]}
        lead={AUTH_VERIFY_COPY.successLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("signIn")}
          >
            Continue to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2ResetPasswordSuccessState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticePositive
        hints={[AUTH_RECOVER_COPY.resetSuccessHint]}
        lead={AUTH_RECOVER_COPY.resetSuccessLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={resolveAuthV2SignInAfterPasswordResetPath()}
          >
            Continue to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2SessionExpiredState() {
  const searchParams = useSearchParams();
  const nextPath = resolveSafeInternalPath(searchParams.get("next"), "");

  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticeCaution
        hints={[AUTH_SECURITY_COPY.sessionExpiredHint]}
        lead={AUTH_SECURITY_COPY.sessionExpiredLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("signIn", {
              next: nextPath.length > 0 ? nextPath : undefined,
            })}
          >
            Sign in again
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2AccessDeniedState() {
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
    <AuthV2Form.Root>
      <AuthV2Form.NoticeCaution hints={[hint]} lead={lead} />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("signIn")}
          >
            Return to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2SecurityReviewState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticeNeutral
        hints={[AUTH_SECURITY_COPY.securityReviewHint]}
        lead={AUTH_SECURITY_COPY.securityReviewLead}
      />
      <AuthSecurityReviewPanel
        formClassName="erp-auth-v2-form__security-review"
        linkClassName="erp-auth-v2-form__link"
        listClassName="erp-auth-v2-form__security-review-steps"
        signInPath={buildAuthV2Path("signIn")}
      />
    </AuthV2Form.Root>
  );
}

export function AuthV2InviteLandingState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticePositive
        hints={[AUTH_INVITE_COPY.inviteLandingHint]}
        lead={AUTH_INVITE_COPY.inviteLandingLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("invite.accept")}
          >
            Accept invitation
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2InviteExpiredState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticeCaution
        hints={[AUTH_INVITE_COPY.inviteExpiredHint]}
        lead={AUTH_INVITE_COPY.inviteExpiredLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("signIn")}
          >
            Return to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2OrganizationSelectStubState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticeNeutral
        hints={[AUTH_WORKSPACE_STUB_COPY.organizationSelectHint]}
        lead={AUTH_WORKSPACE_STUB_COPY.organizationSelectLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link className="erp-auth-v2-form__link" href="/">
            Continue to workspace
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}

export function AuthV2WorkspaceSelectStubState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticeNeutral
        hints={[AUTH_WORKSPACE_STUB_COPY.workspaceSelectHint]}
        lead={AUTH_WORKSPACE_STUB_COPY.workspaceSelectLead}
      />
      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateNotice>
          <Link className="erp-auth-v2-form__link" href="/">
            Continue to workspace
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}
