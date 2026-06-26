import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthVerifyEmailExpiredState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.verifyEmailExpired.metadata;

export default function AuthVerifyEmailExpiredPage() {
  return (
    <AuthEntryPage route="verifyEmailExpired">
      <AuthVerifyEmailExpiredState />
    </AuthEntryPage>
  );
}
