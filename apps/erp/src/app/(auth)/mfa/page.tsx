import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { MfaForm } from "@/app/(auth)/_components/mfa-form";
import { readMfaChallengeCookie } from "@/lib/auth/auth-mfa-challenge.cookies.server";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.mfa.metadata;

export default async function MfaPage() {
  const initialPayload = await readMfaChallengeCookie();

  return (
    <AuthEntryPage route="mfa">
      <Suspense fallback={null}>
        <MfaForm initialPayload={initialPayload} />
      </Suspense>
    </AuthEntryPage>
  );
}
