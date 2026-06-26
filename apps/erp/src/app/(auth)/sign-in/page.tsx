import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { SignInForm } from "@/app/(auth)/_components/sign-in-form";
import { SignInFormFallback } from "@/app/(auth)/_components/sign-in-form-fallback";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";
import { resolveSignInSurface } from "@/lib/auth/resolve-sign-in-surface.server";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.signIn.metadata;

export default function SignInPage() {
  const surface = resolveSignInSurface();

  return (
    <AuthEntryPage route="signIn">
      <Suspense fallback={<SignInFormFallback />}>
        <SignInForm surface={surface} />
      </Suspense>
    </AuthEntryPage>
  );
}
