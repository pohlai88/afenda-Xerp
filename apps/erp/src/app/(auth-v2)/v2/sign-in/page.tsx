import { Suspense } from "react";

import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2SignInForm } from "@/app/(auth-v2)/_components/auth-v2-sign-in-form";
import { AuthV2SignInFormFallback } from "@/app/(auth-v2)/_components/auth-v2-sign-in-form-fallback";
import { resolveSignInSurface } from "@/lib/auth/resolve-sign-in-surface.server";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.signIn.metadata;

export default async function AuthV2SignInPage() {
  const surface = await resolveSignInSurface();

  return (
    <AuthV2EntryPage route="signIn">
      <Suspense fallback={<AuthV2SignInFormFallback />}>
        <AuthV2SignInForm surface={surface} />
      </Suspense>
    </AuthV2EntryPage>
  );
}
