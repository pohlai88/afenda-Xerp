import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthResetPasswordForm } from "@/app/(auth)/_components/auth-reset-password-form";
import { AuthResetPasswordFormFallback } from "@/app/(auth)/_components/auth-reset-password-form-fallback";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.resetPassword.metadata;

export default function AuthResetPasswordPage() {
  return (
    <AuthEntryPage route="resetPassword">
      <Suspense fallback={<AuthResetPasswordFormFallback />}>
        <AuthResetPasswordForm />
      </Suspense>
    </AuthEntryPage>
  );
}
