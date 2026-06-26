import { Suspense } from "react";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthFormFallback } from "@/app/(auth)/_components/auth-form-fallback";
import { AuthAccessDeniedState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.accessDenied.metadata;

export default function AuthAccessDeniedPage() {
  return (
    <AuthEntryPage route="accessDenied">
      <Suspense fallback={<AuthFormFallback route="accessDenied" />}>
        <AuthAccessDeniedState />
      </Suspense>
    </AuthEntryPage>
  );
}
