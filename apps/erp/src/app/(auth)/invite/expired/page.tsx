import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthInviteExpiredState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.inviteExpired.metadata;

export default function AuthInviteExpiredPage() {
  return (
    <AuthEntryPage route="inviteExpired">
      <AuthInviteExpiredState />
    </AuthEntryPage>
  );
}
