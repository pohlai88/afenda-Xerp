import type { Metadata } from "next";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { ForgotPasswordForm } from "@/app/(auth)/_components/forgot-password-form";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.forgotPassword.metadata;

export default function ForgotPasswordPage() {
  return (
    <AuthEntryPage route="forgotPassword">
      <ForgotPasswordForm />
    </AuthEntryPage>
  );
}
