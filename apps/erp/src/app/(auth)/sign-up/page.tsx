import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthSignUpForm } from "@/app/(auth)/_components/auth-sign-up-form";
import { AuthSignUpFormFallback } from "@/app/(auth)/_components/auth-sign-up-form-fallback";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.signUp.metadata;

export default function AuthSignUpPage() {
  return (
    <AuthEntryPage route="signUp">
      <Suspense fallback={<AuthSignUpFormFallback />}>
        <AuthSignUpForm />
      </Suspense>
    </AuthEntryPage>
  );
}
