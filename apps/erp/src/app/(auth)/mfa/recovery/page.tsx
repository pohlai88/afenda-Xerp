import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthFormFallback } from "@/app/(auth)/_components/auth-form-fallback";
import { AuthMfaRecoveryForm } from "@/app/(auth)/_components/auth-mfa-recovery-form";
import { readMfaChallengeCookie } from "@/lib/auth/auth-mfa-challenge.cookies.server";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.mfaRecovery.metadata;

export default async function AuthMfaRecoveryPage() {
  const initialPayload = await readMfaChallengeCookie();

  return (
    <AuthEntryPage route="mfaRecovery">
      <Suspense fallback={<AuthFormFallback route="mfaRecovery" />}>
        <AuthMfaRecoveryForm initialPayload={initialPayload} />
      </Suspense>
    </AuthEntryPage>
  );
}
