import { AuthV2EntryPage } from "@/app/(auth-v2)/_components/auth-v2-entry-page";
import { AuthV2ResetPasswordSuccessState } from "@/app/(auth-v2)/_components/auth-v2-journey-states";
import { AUTH_V2_ROUTE_REGISTRY } from "@/lib/auth-v2/auth-v2-route.registry";

export const metadata = AUTH_V2_ROUTE_REGISTRY.resetPasswordSuccess.metadata;

export default function AuthV2ResetPasswordSuccessPage() {
  return (
    <AuthV2EntryPage route="resetPasswordSuccess">
      <AuthV2ResetPasswordSuccessState />
    </AuthV2EntryPage>
  );
}
