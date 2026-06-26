import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthForgotPasswordForm } from "@/app/(auth)/_components/auth-forgot-password-form";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.forgotPassword.metadata;

export default function AuthForgotPasswordPage() {
  return (
    <AuthEntryPage route="forgotPassword">
      <AuthForgotPasswordForm />
    </AuthEntryPage>
  );
}
