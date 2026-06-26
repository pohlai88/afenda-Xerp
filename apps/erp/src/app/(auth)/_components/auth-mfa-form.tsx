"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import type { AuthSignInMfaMode } from "@/app/(auth)/_components/auth-sign-in-mfa-step";
import { AuthSignInMfaStep } from "@/app/(auth)/_components/auth-sign-in-mfa-step";
import { clearMfaChallengeAction } from "@/lib/auth/auth-mfa-challenge.action";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import type { SignInTwoFactorChallenge } from "@/lib/auth/is-sign-in-two-factor-redirect";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

export type AuthMfaInitialPayload = {
  readonly challenge: SignInTwoFactorChallenge;
  readonly nextPath: string;
} | null;

export function AuthMfaForm({
  initialPayload,
}: {
  readonly initialPayload: AuthMfaInitialPayload;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (initialPayload === null) {
    return <AuthMfaMissingChallengeState />;
  }

  const nextPath =
    resolveSafeInternalPath(searchParams.get("next")) ||
    initialPayload.nextPath;

  const methods = initialPayload.challenge
    .methods as readonly AuthSignInMfaMode[];

  return (
    <AuthSignInMfaStep
      methods={methods}
      nextPath={nextPath}
      onBack={() => {
        void clearMfaChallengeAction().then(() => {
          router.replace(buildAuthPath("signIn", { next: nextPath }));
        });
      }}
    />
  );
}

export function AuthMfaMissingChallengeState() {
  return (
    <AuthForm.Root>
      <AuthForm.NoticeCaution
        hints={["Return to sign in and enter your credentials again."]}
        lead="Your verification session expired."
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
