"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthV2Form } from "@/app/(auth-v2)/_components/auth-v2-form.compound";
import type { AuthV2SignInMfaMode } from "@/app/(auth-v2)/_components/auth-v2-sign-in-mfa-step";
import { AuthV2SignInMfaStep } from "@/app/(auth-v2)/_components/auth-v2-sign-in-mfa-step";
import { clearMfaChallengeAction } from "@/lib/auth/auth-mfa-challenge.action";
import type { SignInTwoFactorChallenge } from "@/lib/auth/is-sign-in-two-factor-redirect";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";

export type AuthV2MfaInitialPayload = {
  readonly challenge: SignInTwoFactorChallenge;
  readonly nextPath: string;
} | null;

export function AuthV2MfaForm({
  initialMode,
  initialPayload,
}: {
  readonly initialMode?: AuthV2SignInMfaMode;
  readonly initialPayload: AuthV2MfaInitialPayload;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (initialPayload === null) {
    return <AuthV2MfaMissingChallengeState />;
  }

  const nextPath =
    resolveSafeInternalPath(searchParams.get("next")) ||
    initialPayload.nextPath;

  const methods: readonly AuthV2SignInMfaMode[] =
    initialMode === "backup-code"
      ? ["backup-code"]
      : initialMode === "otp" &&
          initialPayload.challenge.methods.includes("otp")
        ? ["otp"]
        : initialMode === "totp" &&
            initialPayload.challenge.methods.includes("totp")
          ? ["totp"]
          : (initialPayload.challenge
              .methods as readonly AuthV2SignInMfaMode[]);

  return (
    <AuthV2SignInMfaStep
      methods={methods}
      nextPath={nextPath}
      onBack={() => {
        void clearMfaChallengeAction().then(() => {
          router.replace(buildAuthV2Path("signIn", { next: nextPath }));
        });
      }}
    />
  );
}

export function AuthV2MfaMissingChallengeState() {
  return (
    <AuthV2Form.Root>
      <AuthV2Form.NoticeCaution
        hints={["Return to sign in and enter your credentials again."]}
        lead="Your verification session expired."
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
