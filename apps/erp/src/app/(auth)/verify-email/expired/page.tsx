import type { Metadata } from "next";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { VerifyEmailExpiredState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata =
  AUTH_ROUTE_REGISTRY.verifyEmailExpired.metadata;

export default function VerifyEmailExpiredPage() {
  return (
    <AuthEntryPage route="verifyEmailExpired">
      <VerifyEmailExpiredState />
    </AuthEntryPage>
  );
}
