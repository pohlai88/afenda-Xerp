import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { SignUpForm } from "@/app/(auth)/_components/sign-up-form";
import { SignUpFormFallback } from "@/app/(auth)/_components/sign-up-form-fallback";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.signUp.metadata;

export default function SignUpPage() {
  return (
    <AuthEntryPage route="signUp">
      <Suspense fallback={<SignUpFormFallback />}>
        <SignUpForm />
      </Suspense>
    </AuthEntryPage>
  );
}
