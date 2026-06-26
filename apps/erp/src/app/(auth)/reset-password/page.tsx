import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthFormFallback } from "@/app/(auth)/_components/auth-form-fallback";
import { AuthResetPasswordForm } from "@/app/(auth)/_components/auth-reset-password-form";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.resetPassword.metadata;

export default function AuthResetPasswordPage() {
  return (
    <AuthEntryPage route="resetPassword">
      <Suspense fallback={<AuthFormFallback route="resetPassword" />}>
        <AuthResetPasswordForm />
      </Suspense>
    </AuthEntryPage>
  );
}
