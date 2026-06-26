import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthInviteLandingState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.invite.metadata;

export default function AuthInvitePage() {
  return (
    <AuthEntryPage route="invite">
      <AuthInviteLandingState />
    </AuthEntryPage>
  );
}
