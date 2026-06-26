import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthSessionExpiredState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.sessionExpired.metadata;

export default function AuthSessionExpiredPage() {
  return (
    <AuthEntryPage route="sessionExpired">
      <Suspense fallback={null}>
        <AuthSessionExpiredState />
      </Suspense>
    </AuthEntryPage>
  );
}
