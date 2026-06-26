import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthVerifyEmailState } from "@/app/(auth)/_components/auth-verify-email-state";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.verifyEmail.metadata;

export default function AuthVerifyEmailPage() {
  return (
    <AuthEntryPage route="verifyEmail">
      <AuthVerifyEmailState />
    </AuthEntryPage>
  );
}
