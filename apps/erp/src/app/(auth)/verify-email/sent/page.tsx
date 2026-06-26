import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthVerifyEmailSentState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.verifyEmailSent.metadata;

export default function AuthVerifyEmailSentPage() {
  return (
    <AuthEntryPage route="verifyEmailSent">
      <AuthVerifyEmailSentState />
    </AuthEntryPage>
  );
}
