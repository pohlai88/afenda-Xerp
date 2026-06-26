import type { Metadata } from "next";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { InviteLandingState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.invite.metadata;

export default function InvitePage() {
  return (
    <AuthEntryPage route="invite">
      <InviteLandingState />
    </AuthEntryPage>
  );
}
