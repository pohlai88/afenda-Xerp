import type { Metadata } from "next";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { SecurityReviewStubState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.securityReview.metadata;

export default function SecurityReviewPage() {
  return (
    <AuthEntryPage route="securityReview">
      <SecurityReviewStubState />
    </AuthEntryPage>
  );
}
