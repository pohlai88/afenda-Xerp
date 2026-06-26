import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthResetPasswordSuccessState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.resetPasswordSuccess.metadata;

export default function AuthResetPasswordSuccessPage() {
  return (
    <AuthEntryPage route="resetPasswordSuccess">
      <AuthResetPasswordSuccessState />
    </AuthEntryPage>
  );
}
