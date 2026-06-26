import type { Metadata } from "next";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { VerifyEmailState } from "@/app/(auth)/_components/verify-email-state";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.verifyEmail.metadata;

export default function VerifyEmailPage() {
  return (
    <AuthEntryPage route="verifyEmail">
      <VerifyEmailState />
    </AuthEntryPage>
  );
}
