import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { AuthSecurityReviewState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata = AUTH_ROUTE_REGISTRY.securityReview.metadata;

export default function AuthSecurityReviewPage() {
  return (
    <AuthEntryPage route="securityReview">
      <AuthSecurityReviewState />
    </AuthEntryPage>
  );
}
