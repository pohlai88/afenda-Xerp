import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthSignInForm } from "@/app/(auth)/_components/auth-sign-in-form";
import { AuthSignInFormFallback } from "@/app/(auth)/_components/auth-sign-in-form-fallback";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";
import { resolveSignInSurface } from "@/lib/auth/resolve-sign-in-surface.server";

export const metadata = AUTH_ROUTE_REGISTRY.signIn.metadata;
export const dynamic = "force-dynamic";

export default async function AuthSignInPage() {
  const surface = await resolveSignInSurface();

  return (
    <AuthEntryPage route="signIn">
      <Suspense fallback={<AuthSignInFormFallback />}>
        <AuthSignInForm surface={surface} />
      </Suspense>
    </AuthEntryPage>
  );
}
