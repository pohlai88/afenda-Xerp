"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthForm } from "@/app/(auth)/_components/auth-form.compound";
import { SignInMfaStep } from "@/app/(auth)/_components/sign-in-mfa-step";
import {
  clearPersistedMfaChallenge,
  readPersistedMfaChallenge,
} from "@/lib/auth/auth-mfa-challenge.storage";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import type { SignInTwoFactorMethod } from "@/lib/auth/is-sign-in-two-factor-redirect";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

export function MfaForm({
  initialMode,
}: {
  readonly initialMode?: SignInTwoFactorMethod;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [payload, setPayload] =
    useState<ReturnType<typeof readPersistedMfaChallenge>>(null);

  useEffect(() => {
    const persisted = readPersistedMfaChallenge();
    if (persisted === null) {
      router.replace(buildAuthPath("signIn"));
      return;
    }

    setPayload(persisted);
    setReady(true);
  }, [router]);

  if (!ready || payload === null) {
    return null;
  }

  const nextPath =
    resolveSafeInternalPath(searchParams.get("next")) || payload.nextPath;

  const methods =
    initialMode === "backup-code"
      ? (["backup-code"] as const)
      : initialMode === "otp" && payload.challenge.methods.includes("otp")
        ? (["otp"] as const)
        : payload.challenge.methods;

  return (
    <SignInMfaStep
      methods={methods}
      nextPath={nextPath}
      onBack={() => {
        clearPersistedMfaChallenge();
        router.replace(buildAuthPath("signIn", { next: nextPath }));
      }}
    />
  );
}

export function MfaMissingChallengeState() {
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
