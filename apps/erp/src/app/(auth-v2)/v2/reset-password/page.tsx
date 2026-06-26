import { Suspense } from "react";

import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2ResetPasswordForm } from "@/app/(auth-v2)/_components/auth-v2-reset-password-form";
import { AuthV2ResetPasswordFormFallback } from "@/app/(auth-v2)/_components/auth-v2-reset-password-form-fallback";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.resetPassword.metadata;

export default function AuthV2ResetPasswordPage() {
  return (
    <AuthV2EntryPage route="resetPassword">
      <Suspense fallback={<AuthV2ResetPasswordFormFallback />}>
        <AuthV2ResetPasswordForm />
      </Suspense>
    </AuthV2EntryPage>
  );
}
