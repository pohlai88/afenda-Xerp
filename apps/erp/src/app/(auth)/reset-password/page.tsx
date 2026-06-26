import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { ResetPasswordForm } from "@/app/(auth)/_components/reset-password-form";
import { ResetPasswordFormFallback } from "@/app/(auth)/_components/reset-password-form-fallback";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.resetPassword.metadata;

export default function ResetPasswordPage() {
  return (
    <AuthEntryPage route="resetPassword">
      <Suspense fallback={<ResetPasswordFormFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthEntryPage>
  );
}
