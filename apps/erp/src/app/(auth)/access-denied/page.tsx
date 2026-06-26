import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AccessDeniedState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.accessDenied.metadata;

export default function AccessDeniedPage() {
  return (
    <AuthEntryPage route="accessDenied">
      <Suspense fallback={null}>
        <AccessDeniedState />
      </Suspense>
    </AuthEntryPage>
  );
}
