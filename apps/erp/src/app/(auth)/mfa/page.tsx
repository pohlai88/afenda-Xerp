import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { MfaForm } from "@/app/(auth)/_components/mfa-form";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.mfa.metadata;

export default function MfaPage() {
  return (
    <AuthEntryPage route="mfa">
      <Suspense fallback={null}>
        <MfaForm />
      </Suspense>
    </AuthEntryPage>
  );
}
