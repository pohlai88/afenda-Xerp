import { Suspense } from "react";

import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2SessionExpiredState } from "@/app/(auth-v2)/_components/auth-v2-journey-states";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.sessionExpired.metadata;

export default function AuthV2SessionExpiredPage() {
  return (
    <AuthV2EntryPage route="sessionExpired">
      <Suspense fallback={null}>
        <AuthV2SessionExpiredState />
      </Suspense>
    </AuthV2EntryPage>
  );
}
