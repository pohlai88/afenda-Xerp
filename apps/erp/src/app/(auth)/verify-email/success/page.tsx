import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthVerifyEmailSuccessState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.verifyEmailSuccess.metadata;

export default function AuthVerifyEmailSuccessPage() {
  return (
    <AuthEntryPage route="verifyEmailSuccess">
      <AuthVerifyEmailSuccessState />
    </AuthEntryPage>
  );
}
