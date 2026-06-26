import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2SecurityReviewState } from "@/app/(auth-v2)/_components/auth-v2-journey-states";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.securityReview.metadata;

export default function AuthV2SecurityReviewPage() {
  return (
    <AuthV2EntryPage route="securityReview">
      <AuthV2SecurityReviewState />
    </AuthV2EntryPage>
  );
}
