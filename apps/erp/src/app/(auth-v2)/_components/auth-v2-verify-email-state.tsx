import Link from "next/link";

import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import {
  AUTH_V2_FORM_SIGN_IN_VERIFY_EMAIL_NOTICE_LINK,
  VERIFY_EMAIL_HINT,
  VERIFY_EMAIL_LEAD,
  VERIFY_EMAIL_SPAM_HINT,
} from "@/app/(auth-v2)/_components/auth-v2-form.copy";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";

export function AuthV2VerifyEmailState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.BackToSignIn />

      <AuthV2Form.NoticePositive
        hints={[VERIFY_EMAIL_HINT, VERIFY_EMAIL_SPAM_HINT]}
        lead={VERIFY_EMAIL_LEAD}
      />

      <AuthV2Form.Alternates>
        <AuthV2Form.AlternateLabel>
          Finished verifying?
        </AuthV2Form.AlternateLabel>
        <AuthV2Form.AlternateNotice>
          <Link
            className="erp-auth-v2-form__link"
            href={AUTH_V2_FORM_SIGN_IN_VERIFY_EMAIL_NOTICE_LINK}
          >
            Return to sign in
          </Link>
        </AuthV2Form.AlternateNotice>
        <AuthV2Form.AlternateNotice>
          Need a new invitation?{" "}
          <Link
            className="erp-auth-v2-form__link"
            href={buildAuthV2Path("signUp")}
          >
            Create account
          </Link>
        </AuthV2Form.AlternateNotice>
      </AuthV2Form.Alternates>
    </AuthV2Form.Root>
  );
}
