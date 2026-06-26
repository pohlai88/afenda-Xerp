import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2ForgotPasswordForm } from "@/app/(auth-v2)/_components/auth-v2-forgot-password-form";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.forgotPassword.metadata;

export default function AuthV2ForgotPasswordPage() {
  return (
    <AuthV2EntryPage route="forgotPassword">
      <AuthV2ForgotPasswordForm />
    </AuthV2EntryPage>
  );
}
