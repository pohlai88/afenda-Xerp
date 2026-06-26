import { Suspense } from "react";

import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2SignUpForm } from "@/app/(auth-v2)/_components/auth-v2-sign-up-form";
import { AuthV2SignUpFormFallback } from "@/app/(auth-v2)/_components/auth-v2-sign-up-form-fallback";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.signUp.metadata;

export default function AuthV2SignUpPage() {
  return (
    <AuthV2EntryPage route="signUp">
      <Suspense fallback={<AuthV2SignUpFormFallback />}>
        <AuthV2SignUpForm />
      </Suspense>
    </AuthV2EntryPage>
  );
}
