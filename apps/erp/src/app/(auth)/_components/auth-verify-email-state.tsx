import Link from "next/link";

import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import {
  VERIFY_EMAIL_HINT,
  VERIFY_EMAIL_LEAD,
  VERIFY_EMAIL_SPAM_HINT,
} from "@/lib/auth/auth-copy.registry";
import {
  AUTH_FORM_SIGN_IN_VERIFY_EMAIL_NOTICE_LINK,
  buildAuthPath,
} from "@/lib/auth/auth-path.registry";

export function AuthVerifyEmailState() {
  return (
    <AuthForm.Root>
      <AuthForm.BackToSignIn />

      <AuthForm.NoticePositive
        hints={[VERIFY_EMAIL_HINT, VERIFY_EMAIL_SPAM_HINT]}
        lead={VERIFY_EMAIL_LEAD}
      />

      <AuthForm.Alternates>
        <AuthForm.AlternateLabel>Finished verifying?</AuthForm.AlternateLabel>
        <AuthForm.AlternateNotice>
          <Link
            className="erp-auth-form__link"
            href={AUTH_FORM_SIGN_IN_VERIFY_EMAIL_NOTICE_LINK}
          >
            Return to sign in
          </Link>
        </AuthForm.AlternateNotice>
        <AuthForm.AlternateNotice>
          Need a new invitation?{" "}
          <Link className="erp-auth-form__link" href={buildAuthPath("signUp")}>
            Create account
          </Link>
        </AuthForm.AlternateNotice>
      </AuthForm.Alternates>
    </AuthForm.Root>
  );
}
