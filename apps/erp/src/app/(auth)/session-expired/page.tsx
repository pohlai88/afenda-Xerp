import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { SessionExpiredState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.sessionExpired.metadata;

export default function SessionExpiredPage() {
  return (
    <AuthEntryPage route="sessionExpired">
      <Suspense fallback={null}>
        <SessionExpiredState />
      </Suspense>
    </AuthEntryPage>
  );
}
