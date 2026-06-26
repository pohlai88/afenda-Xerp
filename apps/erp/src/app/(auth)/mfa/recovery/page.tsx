import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthMfaForm } from "@/app/(auth)/_components/auth-mfa-form";
import { readMfaChallengeCookie } from "@/lib/auth/auth-mfa-challenge.cookies.server";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.mfaRecovery.metadata;

export default async function AuthMfaRecoveryPage() {
  const initialPayload = await readMfaChallengeCookie();

  return (
    <AuthEntryPage route="mfaRecovery">
      <Suspense fallback={null}>
        <AuthMfaForm
          initialMode="backup-code"
          initialPayload={initialPayload}
        />
      </Suspense>
    </AuthEntryPage>
  );
}
