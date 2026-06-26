"use client";

// Explicit backup-code-only MFA form variant.
// Avoids the initialMode="backup-code" prop on AuthMfaForm
// per the patterns-explicit-variants rule.
import { useRouter, useSearchParams } from "next/navigation";

import {
  type AuthMfaInitialPayload,
  AuthMfaMissingChallengeState,
} from "@/app/(auth)/_components/auth-mfa-form";
import type { AuthSignInMfaMode } from "@/app/(auth)/_components/auth-sign-in-mfa-step";
import { AuthSignInMfaStep } from "@/app/(auth)/_components/auth-sign-in-mfa-step";
import { clearMfaChallengeAction } from "@/lib/auth/auth-mfa-challenge.action";
import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";

const BACKUP_CODE_METHODS: readonly AuthSignInMfaMode[] = ["backup-code"];

export function AuthMfaRecoveryForm({
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

  return (
    <AuthSignInMfaStep
      methods={BACKUP_CODE_METHODS}
      nextPath={nextPath}
      onBack={() => {
        void clearMfaChallengeAction().then(() => {
          router.replace(buildAuthPath("signIn", { next: nextPath }));
        });
      }}
    />
  );
}
