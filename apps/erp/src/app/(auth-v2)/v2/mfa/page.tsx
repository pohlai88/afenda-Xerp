import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2MfaForm } from "@/app/(auth-v2)/_components/auth-v2-mfa-form";
import { readMfaChallengeCookie } from "@/lib/auth/auth-mfa-challenge.cookies.server";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata: Metadata = AUTH_V2_ROUTE_REGISTRY.mfa.metadata;

export default async function AuthV2MfaPage() {
  const initialPayload = await readMfaChallengeCookie();

  return (
    <AuthV2EntryPage route="mfa">
      <Suspense fallback={null}>
        <AuthV2MfaForm initialPayload={initialPayload} />
      </Suspense>
    </AuthV2EntryPage>
  );
}
